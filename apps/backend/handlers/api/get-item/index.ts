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
import { ITEMS_COLLECTION } from '@/common/constants/database-constants';

const main = getHandler(getSingleItemContract, { ajv })(async (
  event,
  context,
) => {
  const { db } = context as DbConnectionContext;
  const { itemId } = event.pathParameters;

  const item = await db
    .collection(ITEMS_COLLECTION)
    .findOne({ _id: new ObjectId(itemId) });

  if (!item) {
    throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  return httpResponse(item as unknown as ItemType);
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
