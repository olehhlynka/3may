import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { errorSchema } from '../../schemas/error-schema';
import { userSchema } from '../../schemas/user-schema';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';

export const getUserContract = new ApiGatewayContract({
  id: 'getUser',
  path: '/users',
  method: 'GET',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: userSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
