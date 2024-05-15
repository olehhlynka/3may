import { JSONSchema } from 'json-schema-to-ts';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

const headersSchema = {
  type: 'object',
  properties: { Authorization: { type: 'string' } },
  required: ['Authorization'],
} as const satisfies JSONSchema;

export const validateTokenContract = new ApiGatewayContract({
  id: 'validateToken',
  path: '/token',
  method: 'GET',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
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
