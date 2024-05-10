import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const postNewItemContract = new ApiGatewayContract({
  id: 'postLostItem',
  path: '/items/{status}',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      photo: { type: 'string' },
      coordinates: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      date: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
    required: ['title', 'description', 'coordinates', 'date'],
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
    [HttpStatusCodes.BAD_GATEWAY]: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
      additionalProperties: false,
    },
  } as const,
});
