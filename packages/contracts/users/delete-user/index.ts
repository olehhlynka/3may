import { errorSchema } from '../../schemas/error-schema';
import { userSchema } from '../../schemas/user-schema';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const deleteUserContract = new ApiGatewayContract({
  id: 'deleteUser',
  path: '/users',
  method: 'DELETE',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: userSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
