import { errorSchema } from '@/schemas/error-schema';
import { userSchema } from '@/schemas/user-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';

const bodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 60, minLength: 5 },
    photo: { type: 'string', maxLength: 100 },
    email: { type: 'string', maxLength: 20 },
  },
  additionalProperties: false,
  required: ['name', 'photo', 'email'],
} as const satisfies JSONSchema;

export const addNewUserContract = new ApiGatewayContract({
  id: 'addNewUser',
  path: '/users',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: userSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
