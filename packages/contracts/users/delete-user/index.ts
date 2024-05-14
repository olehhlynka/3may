import { errorSchema } from '../../schemas/error-schema';
import { userSchema } from '../../schemas/user-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';

const pathParametersSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['userId'],
} as const satisfies JSONSchema;

export const deleteUserContract = new ApiGatewayContract({
  id: 'deleteUser',
  path: '/users/{userId}',
  method: 'DELETE',
  integrationType: 'restApi',
  pathParametersSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: userSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
