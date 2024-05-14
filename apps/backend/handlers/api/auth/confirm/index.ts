import cors from '@middy/http-cors';
import middy from '@middy/core';
import { confirmContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { USERS_COLLECTION } from '@/common/constants/database-constants';
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

const client = new CognitoIdentityProviderClient({});

const main = getHandler(confirmContract, { ajv })(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { username, code } = event.body;

  await client.send(
    new ConfirmSignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID!,
      Username: username,
      ConfirmationCode: code,
    }),
  );

  const response = await client.send(
    new AdminGetUserCommand({
      UserPoolId: process.env.USER_POOL_CLIENT_ID!,
      Username: username,
    }),
  );

  if (!response) {
    throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  const emailAttribute = response.UserAttributes?.find(
    (attr) => attr.Name === 'email',
  );
  const email = emailAttribute ? emailAttribute.Value : null;

  if (!email) {
    throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
  }

  const insertResult = await db.collection(USERS_COLLECTION).insertOne({
    username,
    email,
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
