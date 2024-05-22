import { errorSchema } from '../../schemas/error-schema';
import { ItemStatus } from '@3may/types';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { itemSchema, requestContextSchemaCustom } from '../..';

export const updateItemContract = new ApiGatewayContract({
  id: 'updateItem',
  path: '/items/{itemId}',
  method: 'PUT',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  bodySchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      photo: { type: 'string' },
      lng: { type: 'number', minimum: -180, maximum: 180 },
      lat: { type: 'number', minimum: -90, maximum: 90 },
      date: { type: 'string' },
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
