import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const signUpContract = new ApiGatewayContract({
  id: 'signUp',
  path: '/signup',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      password: { type: 'string' },
      email: { type: 'string' },
      login: { type: 'string' },
    },
    additionalProperties: false,
    required: ['password', 'email', 'login'],
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        login: { type: 'string' },
      },
      required: ['login'],
      additionalProperties: false,
    } as const,
  } as const,
});
