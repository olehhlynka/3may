import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, UserType, addNewCommentContract } from '@3may/contracts';
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
import { SQS } from '@aws-sdk/client-sqs';

const sqs = new SQS();

const main = getHandler(addNewCommentContract, { ajv, validateOutput: false })(
  async (event, context) => {
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
      user: user._id,
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

    const updatedPost = updateResult as unknown as ItemType;
    const postOwner = await db
      .collection<UserType>(USERS_COLLECTION)
      .findOne({ _id: updatedPost.user._id });

    if (postOwner?._id !== user._id && postOwner?.allowNotifications) {
      const sqsParams = {
        MessageBody: JSON.stringify({
          email: updatedPost.user.email,
          text: `User ${user.username} has left a commend under your post <b>${updatedPost.title}</b>.<br><br>Comment: <i>${text}</i>`,
          title: `New comment for ${updatedPost.title}`,
        }),
        QueueUrl: process.env.NOTIFICATIONS_SQS_URL!,
      };

      await sqs.sendMessage(sqsParams);
    }

    return httpResponse({ id: comment._id.toString() });
  },
);

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
