import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, updateItemContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { itemStatusMap } from '@3may/types';
import { ITEMS_COLLECTION } from '@/common/constants/database-constants';
import { ObjectId } from 'mongodb';

const main = getHandler(updateItemContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { itemId } = event.pathParameters;
  const { title, description, photo, lng, lat, date, tags, status } =
    event.body;

  const insertResult = await db.collection(ITEMS_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status: itemStatusMap[status] }),
        ...(lng &&
          lat && { location: { type: 'Point', coordinates: [lng, lat] } }),
        ...(photo && { photo }),
        ...(date && { date }),
        ...(tags && { tags }),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' },
  );

  if (!insertResult) {
    throw new Error('Item not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  return httpResponse(insertResult as unknown as ItemType);
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
