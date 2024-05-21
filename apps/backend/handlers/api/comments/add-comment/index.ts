import cors from '@middy/http-cors';
import middy from '@middy/core';
import { UserType, addNewCommentContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import {
  ITEMS_COLLECTION,
  USERS_COLLECTION,
} from '@/common/constants/database-constants';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { ObjectId } from 'mongodb';

const main = getHandler(addNewCommentContract, { ajv })(async (
  event,
  context,
) => {
  const { db } = context as DbConnectionContext;
  const { text } = event.body;
  const { itemId } = event.pathParameters;
  const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

  const user = await db
    .collection<UserType>(USERS_COLLECTION)
    .findOne({ cognitoId });

  if (!user) {
    throw new Error('User not found', { cause: HttpStatusCodes.FORBIDDEN });
  }

  const comment = {
    _id: new ObjectId(),
    user: {
      userId: new ObjectId(user._id),
      name: user.name,
      photoUrl: user.photo,
    },
    text: text,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updateResult = await db.collection(ITEMS_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    {
      $addToSet: {
        comments: comment,
      },
    },
  );

  if (!updateResult) {
    throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  return httpResponse({ id: comment._id.toString() });
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());