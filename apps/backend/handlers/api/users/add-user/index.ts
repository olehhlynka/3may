import cors from '@middy/http-cors';
import middy from '@middy/core';
import { addNewUserContract } from '@3may/contracts';
import { getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { USERS_COLLECTION } from '@/common/constants/database-constants';

const main = getHandler(addNewUserContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { name, email, photo } = event.body;

  const insertResult = await db.collection(USERS_COLLECTION).insertOne({
    name,
    email,
    photo,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return httpResponse({ id: insertResult.insertedId.toString() });
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
