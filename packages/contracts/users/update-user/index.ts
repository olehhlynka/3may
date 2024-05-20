import { errorSchema } from '../../schemas/error-schema';
import { userSchema } from '../../schemas/user-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';

const bodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 60, minLength: 2 },
    photo: { type: 'string', maxLength: 100 },
  },
  additionalProperties: false,
} as const satisfies JSONSchema;

export const updateUserContract = new ApiGatewayContract({
  id: 'updateUser',
  path: '/users',
  method: 'PUT',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  bodySchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: userSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
