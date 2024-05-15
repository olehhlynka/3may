import { requestContextSchema } from '@/schemas/request-context-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';

const headersSchema = {
  type: 'object',
  properties: { authorization: { type: 'string' } },
  required: ['authorization'],
} as const satisfies JSONSchema;

export const validateTokenContract = new ApiGatewayContract({
  id: 'validateToken',
  path: '/token',
  method: 'GET',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema,
  headersSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
      required: ['username'],
      additionalProperties: false,
    } as const,
  } as const,
});
