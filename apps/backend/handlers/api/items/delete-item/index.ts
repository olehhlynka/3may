import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, deleteItemContract } from '@3may/contracts';
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
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(deleteItemContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { itemId } = event.pathParameters;

  const deletedItem = await db
    .collection(ITEMS_COLLECTION)
    .findOneAndDelete({ _id: new ObjectId(itemId) });

  if (!deletedItem) {
    throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  return httpResponse(deletedItem as unknown as ItemType);
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
