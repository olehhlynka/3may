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
import {
  ITEMS_COLLECTION,
  USERS_COLLECTION,
} from '@/common/constants/database-constants';
import { ObjectId } from 'mongodb';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(updateItemContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { itemId } = event.pathParameters;
  const { title, description, photo, lng, lat, date, tags, status } =
    event.body;
  const { sub: cognitoId } = event.requestContext.authorizer.claims;

  const user = await db.collection(USERS_COLLECTION).findOne({ cognitoId });

  if (!user) {
    throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  const existingItem = await db
    .collection(ITEMS_COLLECTION)
    .findOne({ _id: new ObjectId(itemId) });

  if (!existingItem || existingItem.user !== user._id) {
    throw new Error('Unauthorized', { cause: HttpStatusCodes.UNAUTHORIZED });
  }

  const insertResult = await db.collection(ITEMS_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(lng && { 'location.coordinates.0': lng }),
        ...(lat && { 'location.coordinates.1': lat }),
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
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
