import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const confirmContract = new ApiGatewayContract({
  id: 'confirm',
  path: '/confirm',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      code: { type: 'string' },
      login: { type: 'string' },
    },
    additionalProperties: false,
    required: ['username', 'code', 'login'],
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
  } as const,
});
