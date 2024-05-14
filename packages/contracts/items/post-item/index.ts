import { errorSchema } from '../../schemas/error-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const postNewItemContract = new ApiGatewayContract({
  id: 'postNewItem',
  path: '/items/{status}',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      photo: { type: 'string', maxLength: 100 },
      lng: { type: 'number', minimum: -180, maximum: 180 },
      lat: { type: 'number', minimum: -90, maximum: 90 },
      date: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
    required: ['title', 'description', 'date', 'lng', 'lat'],
  } as const,
  pathParametersSchema: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['lost', 'found'] },
    },
    additionalProperties: false,
    required: ['status'],
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
      additionalProperties: false,
    } as const,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
