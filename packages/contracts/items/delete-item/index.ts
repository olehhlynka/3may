import { errorSchema } from '../../schemas/error-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';
import { itemSchema, requestContextSchema } from '../..';

const pathParametersSchema = {
  type: 'object',
  properties: {
    itemId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['itemId'],
} as const satisfies JSONSchema;

export const deleteItemContract = new ApiGatewayContract({
  id: 'deleteItem',
  path: '/items/{itemId}',
  method: 'DELETE',
  integrationType: 'restApi',
  pathParametersSchema,
  requestContextSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: itemSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
