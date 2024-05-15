import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { JSONSchema } from 'json-schema-to-ts';
import { errorSchema } from '../../schemas/error-schema';
import { itemSchema } from '../../schemas/item-schema';
import { ItemStatus } from '@3may/types';
import { requestContextSchema } from '../../schemas/request-context-schema';

const queryStringParametersSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: Object.values(ItemStatus) },
    title: { type: 'string', maxLength: 60 },
    description: { type: 'string', maxLength: 60 },
    lng: { type: 'string' },
    lat: { type: 'string' },
    dist: { type: 'string' },
    dateFrom: { type: 'string', maxLength: 15 },
    dateTo: { type: 'string', maxLength: 15 },
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
  },
  additionalProperties: false,
  required: ['items'],
} as const satisfies JSONSchema;

export const searchItemsContract = new ApiGatewayContract({
  id: 'searchItems',
  path: '/items/search',
  method: 'GET',
  integrationType: 'restApi',
  queryStringParametersSchema,
  requestContextSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: successSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
