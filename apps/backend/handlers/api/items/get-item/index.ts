import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, getSingleItemContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { ObjectId } from 'mongodb';
import {
  ITEMS_COLLECTION,
  USERS_COLLECTION,
} from '@/common/constants/database-constants';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(getSingleItemContract, { ajv, validateOutput: false })(
  async (event, context) => {
    const { db } = context as DbConnectionContext;
    const { itemId } = event.pathParameters;
    const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

    const user = await db.collection(USERS_COLLECTION).findOne({ cognitoId });

    if (!user) {
      throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
    }

    const result = await db
      .collection(ITEMS_COLLECTION)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(itemId),
          },
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.user',
            foreignField: '_id',
            as: 'comments.user',
          },
        },
        {
          $unwind: {
            path: '$comments.user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            location: 1,
            photo: 1,
            date: 1,
            user: 1,
            createdAt: 1,
            updatedAt: 1,
            'comments._id': 1,
            'comments.text': 1,
            'comments.createdAt': 1,
            'comments.updatedAt': 1,
            'comments.user._id': 1,
            'comments.user.username': 1,
            'comments.user.photoUrl': 1,
          },
        },
        {
          $group: {
            _id: '$_id',
            title: {
              $first: '$title',
            },
            description: { $first: '$description' },
            status: { $first: '$status' },
            location: { $first: '$location' },
            photo: { $first: '$photo' },
            date: { $first: '$date' },
            user: { $first: '$user' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            comments: { $push: '$comments' },
          },
        },
      ])
      .toArray();

    if (!result[0]) {
      throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
    }

    if (Object.keys(result[0].comments[0]).length === 0) {
      return httpResponse({
        ...result[0],
        comments: [],
      } as unknown as ItemType);
    }

    return httpResponse(result[0] as unknown as ItemType);
  },
);

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
