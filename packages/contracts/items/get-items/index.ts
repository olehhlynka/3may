import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { JSONSchema } from 'json-schema-to-ts';
import { errorSchema } from '../../schemas/error-schema';
import { itemSchema } from '../../schemas/item-schema';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';

// const headersSchema = {
//   type: 'object',
//   properties: { Authorization: { type: 'string' } },
//   required: ['Authorization'],
// } as const satisfies JSONSchema;

const queryStringParametersSchema = {
  type: 'object',
  properties: {
    lng: { type: 'string' },
    lat: { type: 'string' },
    dist: { type: 'string' },
    page: { type: 'string' },
    limit: { type: 'string' },
  },
  additionalProperties: false,
  required: ['lng', 'lat'],
} as const satisfies JSONSchema;

const successSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: itemSchema,
    },
  },
  additionalProperties: false,
  required: ['items'],
} as const satisfies JSONSchema;

export const getItemsContract = new ApiGatewayContract({
  id: 'getItems',
  path: '/items',
  method: 'GET',
  integrationType: 'restApi',
  queryStringParametersSchema,
  authorizerType: 'cognito',
  //headersSchema,
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: successSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
