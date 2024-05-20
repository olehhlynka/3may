import { JSONSchema } from 'json-schema-to-ts';
import { errorSchema } from '../../schemas/error-schema';
import { requestContextSchemaCustom } from '../../schemas/request-context-schema';
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

const headersSchema = {
  type: 'object',
  properties: { Authorization: { type: 'string' } },
  required: ['Authorization'],
} as const satisfies JSONSchema;

export const editCommentContract = new ApiGatewayContract({
  id: 'addNewComment',
  path: '/items/{itemId}/comment/{commentId}',
  method: 'PUT',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  //headersSchema,
  requestContextSchema: requestContextSchemaCustom,
  bodySchema: {
    type: 'object',
    properties: {
      text: { type: 'string' },
    },
    additionalProperties: false,
  } as const,
  pathParametersSchema: {
    type: 'object',
    properties: {
      itemId: { type: 'string' },
      commentId: { type: 'string' },
    },
    additionalProperties: false,
    required: ['itemId', 'commentId'],
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
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
