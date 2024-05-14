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
import { ITEMS_COLLECTION } from '@/common/constants/database-constants';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(postNewItemContract, { ajv })(async (
  event,
  context,
) => {
  const { db } = context as DbConnectionContext;
  const { title, description, photo, lng, lat, date, tags } = event.body;
  const { status } = event.pathParameters;

  const insertResult = await db.collection(ITEMS_COLLECTION).insertOne({
    title,
    description,
    status: status,
    location: { type: 'Point', coordinates: [lng, lat] },
    photo,
    date,
    tags,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return httpResponse({ id: insertResult.insertedId.toString() });
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
