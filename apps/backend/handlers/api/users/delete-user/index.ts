import cors from '@middy/http-cors';
import middy from '@middy/core';
import { UserType, deleteUserContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { ObjectId } from 'mongodb';
import { USERS_COLLECTION } from '@/common/constants/database-constants';

const main = getHandler(deleteUserContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { userId } = event.pathParameters;

  const deletedItem = await db
    .collection(USERS_COLLECTION)
    .findOneAndDelete({ _id: new ObjectId(userId) });

  if (!deletedItem) {
    throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  return httpResponse(deletedItem as unknown as UserType);
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
