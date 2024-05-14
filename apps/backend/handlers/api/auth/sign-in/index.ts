import cors from '@middy/http-cors';
import middy from '@middy/core';
import { signInContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import { dbConnection } from '@/middlewares/database-connection-middleware';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

const main = getHandler(signInContract, { ajv })(async (event) => {
  const { username, password } = event.body;

  const result = await client.send(
    new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.USER_POOL_CLIENT_ID!,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }),
  );

  const token = result.AuthenticationResult?.IdToken;

  if (token === undefined) {
    throw new Error('Unauthorized', { cause: HttpStatusCodes.UNAUTHORIZED });
  }

  return httpResponse({ token });
});

export const handler = middy(main)
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
