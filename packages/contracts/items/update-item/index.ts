import { errorSchema } from '../../schemas/error-schema';
import { ItemStatus } from '@3may/types';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { itemSchema, requestContextSchema } from '../..';

export const updateItemContract = new ApiGatewayContract({
  id: 'updateItem',
  path: '/items/{itemId}',
  method: 'PUT',
  integrationType: 'restApi',
  requestContextSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  } as const,
  bodySchema: {
    type: 'object',
    properties: {
      title: { type: 'string', maxLength: 60, minLength: 10 },
      description: { type: 'string', maxLength: 200, minLength: 30 },
      photo: { type: 'string', maxLength: 100 },
      lng: { type: 'number', minimum: -180, maximum: 180 },
      lat: { type: 'number', minimum: -90, maximum: 90 },
      date: { type: 'string', maxLength: 15 },
      tags: { type: 'array', items: { type: 'string' } },
      status: { type: 'string', enum: Object.values(ItemStatus) },
    },
    additionalProperties: false,
  } as const,
  pathParametersSchema: {
    type: 'object',
    properties: {
      itemId: { type: 'string' },
    },
    additionalProperties: false,
    required: ['itemId'],
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: itemSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
