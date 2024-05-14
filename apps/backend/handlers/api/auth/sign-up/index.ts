import cors from '@middy/http-cors';
import middy from '@middy/core';
import { signUpContract } from '@3may/contracts';
import { getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { USERS_COLLECTION } from '@/common/constants/database-constants';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

const main = getHandler(signUpContract, { ajv })(async (event, context) => {
  const { username, password, email } = event.body;

  await client.send(
    new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID!,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    }),
  );

  return httpResponse({ message: 'User created' });
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
