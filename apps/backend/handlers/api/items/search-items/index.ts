import cors from '@middy/http-cors';
import middy from '@middy/core';
import { ItemType, searchItemsContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { ITEMS_COLLECTION } from '@/common/constants/database-constants';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { Document } from 'mongodb';

const DEFAULT_DISTANCE_M = 5_000;

const DEFAULT_LIMIT = 4;
const DEFAULT_ORDER = -1;

const orderMap: Record<string, number> = {
  ['desc']: -1,
  ['asc']: 1,
};

function areValidCoordinates(longitude: number, latitude: number) {
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    return false;
  }

  return true;
}

const main = getHandler(searchItemsContract, { ajv, validateOutput: false })(
  async (event, context) => {
    const { db } = context as DbConnectionContext;
    const {
      lat,
      lng,
      dist,
      page,
      limit,
      type,
      dateFrom,
      dateTo,
      description,
      order,
      sortBy,
    } = event.queryStringParameters;

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

    const pipe: Document[] = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          distanceField: 'dist',
          maxDistance: dist ? Number(dist) : DEFAULT_DISTANCE_M,
          query: {
            ...(type && { status: type }),
            ...(description && {
              $or: [
                { title: new RegExp(description, 'ig') },
                { description: new RegExp(description, 'ig') },
              ],
            }),
            ...(dateFrom && { date: { $gte: new Date(dateFrom) } }),
            ...(dateTo && { date: { $lte: new Date(dateTo) } }),
          },
        },
      },
    ];

    if (sortBy) {
      pipe.push({
        $sort: {
          [sortBy]: order ? orderMap[order] : DEFAULT_ORDER,
        },
      });
    }

    pipe.push({
      $facet: {
        paginatedResults: [{ $skip: itemsSkip }, { $limit: itemsLimit }],
        totalData: [{ $count: 'count' }],
      },
    });

    const queryResult = await db
      .collection(ITEMS_COLLECTION)
      .aggregate<{
        paginatedResults: ItemType[];
        totalData: { count: number }[];
      }>(pipe)
      .toArray();

    if (!queryResult[0]) {
      return httpResponse({ items: [], total: 0 });
    }

    const { paginatedResults: items, totalData } = queryResult[0];

    return httpResponse({ items, total: totalData[0]?.count ?? 0 });
  },
);

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
