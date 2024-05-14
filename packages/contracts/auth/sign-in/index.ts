import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const signInContract = new ApiGatewayContract({
  id: 'signIn',
  path: '/signin',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
    additionalProperties: false,
    required: ['username', 'password'],
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
      required: ['token'],
      additionalProperties: false,
    } as const,
  } as const,
});
