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
    },
    additionalProperties: false,
    required: ['password', 'email'],
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
      additionalProperties: false,
    } as const,
  } as const,
});
