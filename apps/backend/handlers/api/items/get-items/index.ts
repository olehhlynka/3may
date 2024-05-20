import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, getItemsContract } from '@3may/contracts';
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
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const DEFAULT_DISTANCE_M = 5_000;
const EARTH_RADIUS_M = 6_378_100;

const DEFAULT_LIMIT = 10;

function areValidCoordinates(longitude: number, latitude: number) {
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    return false;
  }

  return true;
}

function getDistanceInRadians(distance?: string | number) {
  return (distance ? Number(distance) : DEFAULT_DISTANCE_M) / EARTH_RADIUS_M;
}

const main = getHandler(getItemsContract, { ajv, validateOutput: false })(
  async (event, context) => {
    const { db } = context as DbConnectionContext;
    const { lat, lng, dist, page, limit } = event.queryStringParameters;
    const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

    const user = await db.collection(USERS_COLLECTION).findOne({ cognitoId });

    if (!user) {
      throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
    }

    if (!areValidCoordinates(Number(lng), Number(lat))) {
      throw new Error('Provided coordinates are not valid', {
        cause: HttpStatusCodes.BAD_REQUEST,
      });
    }

    if (dist && Number(dist) < 0) {
      throw new Error('Provided distance is not valid', {
        cause: HttpStatusCodes.BAD_REQUEST,
      });
    }

    if (limit && Number(limit) < 0) {
      throw new Error('Provided distance is not valid', {
        cause: HttpStatusCodes.BAD_REQUEST,
      });
    }

    if (page && Number(page) < 1) {
      throw new Error('Provided distance is not valid', {
        cause: HttpStatusCodes.BAD_REQUEST,
      });
    }

    const itemsSkip =
      (limit ? Number(limit) : DEFAULT_LIMIT) * (page ? Number(page) - 1 : 0);
    const itemsLimit = limit ? Number(limit) : DEFAULT_LIMIT;

    const items = await db
      .collection<ItemType>(ITEMS_COLLECTION)
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [
              [Number(lng), Number(lat)],
              getDistanceInRadians(dist),
            ],
          },
        },
      })
      .skip(itemsSkip)
      .limit(itemsLimit)
      .toArray();

    return httpResponse({ items });
  },
);

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
