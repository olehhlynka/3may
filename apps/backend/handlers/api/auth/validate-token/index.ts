import cors from '@middy/http-cors';
import middy from '@middy/core';
import { validateTokenContract } from '@3may/contracts';
import { getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import { dbConnection } from '@/middlewares/database-connection-middleware';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const main = getHandler(validateTokenContract, { ajv })(async (event) => {
  return httpResponse({
    username: event.requestContext.authorizer.jwt.claims.email,
  });
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
