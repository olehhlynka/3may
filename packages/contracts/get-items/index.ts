import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { JSONSchema } from 'json-schema-to-ts';

import { ItemStatus } from '@3may/types';
import { errorSchema } from '@/schemas/error-schema';

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
    title: { type: 'string' },
    status: { type: 'string', enum: ItemStatus },
    description: { type: 'string' },
    photo: { type: 'string' },
    coordinates: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    user: { type: 'object' }, //TODO: provide context
    date: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  },
  additionalProperties: false,
  required: ['title', 'description', 'coordinates', 'date', 'status', 'user'],
} as const satisfies JSONSchema;

export const getItemsContract = new ApiGatewayContract({
  id: 'getItems',
  path: '/items',
  method: 'GET',
  integrationType: 'restApi',
  queryStringParametersSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: successSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
