import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, UserType, editCommentContract } from '@3may/contracts';
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
import { ObjectId } from 'mongodb';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { SQS } from '@aws-sdk/client-sqs';

const sqs = new SQS();

const main = getHandler(editCommentContract, { ajv })(async (
  event,
  context,
) => {
  const { db } = context as DbConnectionContext;
  const { itemId, commentId } = event.pathParameters;
  const { text } = event.body;
  const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

  const user = await db.collection(USERS_COLLECTION).findOne({ cognitoId });

  if (!user) {
    throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  const item = await db
    .collection(ITEMS_COLLECTION)
    .findOne({ _id: new ObjectId(itemId) });

  if (!item) {
    throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  const itemTyped = item as unknown as ItemType;
  const postOwner = await db
    .collection<UserType>(USERS_COLLECTION)
    .findOne({ _id: item.user._id });
  const comment = itemTyped.comments?.find(
    (comment) => comment._id.toString() === commentId,
  );

  if (!comment) {
    throw new Error('Bad Request', { cause: HttpStatusCodes.BAD_REQUEST });
  }

  if (user._id.toString() !== itemTyped.user.toString()) {
    if (user._id.toString() !== comment.user.toString()) {
      throw new Error('Forbidden', { cause: HttpStatusCodes.FORBIDDEN });
    }
  }

  const insertResult = await db.collection(ITEMS_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(itemId), 'comments._id': new ObjectId(commentId) },
    {
      $set: {
        ...(text && { 'comments.$.text': text }),
        'comments.$.updatedAt': new Date(),
      },
    },
    { returnDocument: 'after' },
  );

  if (!insertResult) {
    throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  if (postOwner?._id !== String(user._id) && postOwner?.allowNotifications) {
    const sqsParams = {
      MessageBody: JSON.stringify({
        email: item.user.email,
        text: `User ${user.username} has updated the commend under your post <b>${item.title}</b>.<br><br>Comment old: <i>${comment.text}</i><br>Comment new: ${text}`,
        title: `Comment under your post ${item.title} was changed`,
      }),
      QueueUrl: process.env.NOTIFICATIONS_SQS_URL!,
    };

    await sqs.sendMessage(sqsParams);
  }

  return httpResponse({ id: insertResult._id.toString() });
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
