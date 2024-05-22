import cors from '@middy/http-cors';
import middy from '@middy/core';
import { UserType, deleteUserContract } from '@3may/contracts';
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
import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
  DeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

const main = getHandler(deleteUserContract, { ajv, validateOutput: false })(
  async (event, context) => {
    const { db } = context as DbConnectionContext;
    const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

    const deletedItem = await db
      .collection<UserType>(USERS_COLLECTION)
      .findOneAndDelete({ cognitoId });

    if (!deletedItem) {
      throw new Error('User not found', { cause: HttpStatusCodes.NOT_FOUND });
    }

    await client.send(
      new AdminDeleteUserCommand({
        UserPoolId: process.env.USER_POOL_ID!,
        Username: deletedItem.email,
      }),
    );

    return httpResponse(deletedItem as unknown as UserType);
  },
);

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
