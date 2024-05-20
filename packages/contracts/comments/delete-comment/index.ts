import { errorSchema } from '../../schemas/error-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';
import { requestContextSchemaCustom } from '../..';
import { commentSchema } from '../../schemas/comment-schema';

const pathParametersSchema = {
  type: 'object',
  properties: {
    itemId: { type: 'string' },
    commentId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['itemId', 'commentId'],
} as const satisfies JSONSchema;

export const deleteCommentContract = new ApiGatewayContract({
  id: 'deleteItem',
  path: '/items/{itemId}/comment/{commentId}',
  method: 'DELETE',
  integrationType: 'restApi',
  pathParametersSchema,
  authorizerType: 'cognito',
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: commentSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
