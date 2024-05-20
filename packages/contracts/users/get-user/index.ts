import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { JSONSchema } from 'json-schema-to-ts';
import { errorSchema } from '../../schemas/error-schema';
import { userSchema } from '../../schemas/user-schema';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';

const pathParametersSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['userId'],
} as const satisfies JSONSchema;

export const getUserContract = new ApiGatewayContract({
  id: 'getUser',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: userSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
