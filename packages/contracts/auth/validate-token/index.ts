import { requestContextSchemaCustom } from '../../schemas/request-context-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const validateTokenContract = new ApiGatewayContract({
  id: 'validateToken',
  path: '/token',
  method: 'GET',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
      required: ['username'],
      additionalProperties: false,
    } as const,
  } as const,
});
