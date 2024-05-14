import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, updateUserContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { USERS_COLLECTION } from '@/common/constants/database-constants';
import { ObjectId } from 'mongodb';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(updateUserContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { userId } = event.pathParameters;
  const { name, email, photo } = event.body;

  const insertResult = await db.collection(USERS_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...(name && { name }),
        ...(email && { email }),
        ...(photo && { photo }),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' },
  );

  if (!insertResult) {
    throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  return httpResponse(insertResult as unknown as ItemType);
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
