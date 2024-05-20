import cors from '@middy/http-cors';
import middy from '@middy/core';
import { UserType, getUserContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { USERS_COLLECTION } from '@/common/constants/database-constants';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(getUserContract, { ajv, validateOutput: false })(async (
  event,
  context,
) => {
  const { db } = context as DbConnectionContext;
  const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

  const user = await db.collection(USERS_COLLECTION).findOne({ cognitoId });

  if (!user) {
    throw new Error('Forbidden', { cause: HttpStatusCodes.FORBIDDEN });
  }

  return httpResponse(user as unknown as UserType);
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
