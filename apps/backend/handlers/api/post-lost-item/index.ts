import cors from '@middy/http-cors';
import middy from '@middy/core';
import { postNewItemContract } from '@3may/contracts';
import { getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';

enum ItemStatus {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

const itemStatusMap: Record<string, ItemStatus> = {
  lost: ItemStatus.LOST,
  found: ItemStatus.FOUND,
};

const main = getHandler(postNewItemContract, { ajv })(async (
  event,
  context,
) => {
  const { db, mongoClient } = context as DbConnectionContext;
  const { title, description, photo, coordinates, date, tags } = event.body;
  const { status } = event.pathParameters;

  const insertResult = await db.collection('items').insertOne({
    title,
    description,
    status: itemStatusMap[status],
    location: { type: 'Point', coordinates },
    photo,
    date,
    tags,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return httpResponse({ id: insertResult.insertedId.toString() });
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
