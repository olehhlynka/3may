import middy from '@middy/core';
import { Context } from 'aws-lambda';
import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export interface DbConnectionContext extends Context {
  mongoClient: MongoClient;
  db: Db;
}

const dbConnection = (): middy.MiddlewareObj<
  unknown,
  unknown,
  unknown,
  DbConnectionContext
> => {
  const before: middy.MiddlewareFn<
    unknown,
    unknown,
    unknown,
    DbConnectionContext
  > = async (handler) => {
    if (!cachedClient || !cachedDb) {
      cachedClient = await MongoClient.connect(process.env.MONGO_URL!);

      cachedDb = cachedClient.db(process.env.DB_NAME!);
    }

    Object.assign(handler.context, { mongoClient: cachedClient, db: cachedDb });
  };

  return { before };
};

export { dbConnection };
