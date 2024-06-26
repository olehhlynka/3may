import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { JSONSchema } from 'json-schema-to-ts';
import { errorSchema } from '../../schemas/error-schema';
import { itemSchema } from '../../schemas/item-schema';
import { ItemStatus } from '@3may/types';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';

const queryStringParametersSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: Object.values(ItemStatus) },
    description: { type: 'string' },
    lng: { type: 'string' },
    lat: { type: 'string' },
    dist: { type: 'string' },
    dateFrom: { type: 'string' },
    dateTo: { type: 'string' },
    tags: { type: 'string', maxLength: 100 },
    sortBy: { type: 'string', enum: ['dist', 'date'] },
    order: { type: 'string', enum: ['asc', 'desc'] },
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
    total: { type: 'number' },
  },
  additionalProperties: false,
  required: ['items', 'total'],
} as const satisfies JSONSchema;

export const searchItemsContract = new ApiGatewayContract({
  id: 'searchItems',
  path: '/items/search',
  method: 'GET',
  integrationType: 'restApi',
  queryStringParametersSchema,
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: successSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
