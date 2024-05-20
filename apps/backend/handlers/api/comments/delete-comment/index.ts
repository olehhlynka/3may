import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, deleteCommentContract } from '@3may/contracts';
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

const main = getHandler(deleteCommentContract, { ajv, validateOutput: false })(
  async (event, context) => {
    const { db } = context as DbConnectionContext;
    const { itemId, commentId } = event.pathParameters;
    const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

    const user = await db.collection(USERS_COLLECTION).findOne({ cognitoId });

    if (!user) {
      throw new Error('User not found', { cause: HttpStatusCodes.FORBIDDEN });
    }

    const item = await db
      .collection(ITEMS_COLLECTION)
      .findOne({ _id: new ObjectId(itemId) });

    if (!item) {
      throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
    }

    const itemTyped = item as unknown as ItemType;
    const comment = itemTyped.comments?.find(
      (comment) => comment._id.toString() === commentId,
    );

    if (!comment) {
      throw new Error('Bad Request', { cause: HttpStatusCodes.BAD_REQUEST });
    }

    if (user._id.toString() !== itemTyped.user.toString()) {
      if (user._id.toString() !== comment.user.userId.toString()) {
        throw new Error('Forbidden', { cause: HttpStatusCodes.FORBIDDEN });
      }
    }

    await db.collection(ITEMS_COLLECTION).updateOne(
      { _id: item._id },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $pull: { comments: { _id: new ObjectId(commentId) } as any },
      },
    );

    return httpResponse(comment);
  },
);

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
