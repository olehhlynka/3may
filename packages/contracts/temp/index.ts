import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const postFoundItemContract = new ApiGatewayContract({
  id: 'postLostItem',
  path: '/found',
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
      date: { type: 'string', format: 'date-time' },
      tags: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
    required: ['title', 'description', 'coordinates', 'date'],
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
    [HttpStatusCodes.BAD_GATEWAY]: {
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      required: ['message'],
      additionalProperties: false,
    },
  } as const,
});
