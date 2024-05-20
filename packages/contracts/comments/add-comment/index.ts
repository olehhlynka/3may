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

export const addNewCommentContract = new ApiGatewayContract({
  id: 'addNewComment',
  path: '/items/{itemId}/comment',
  method: 'POST',
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
    required: ['text'],
  } as const,
  pathParametersSchema: {
    type: 'object',
    properties: {
      itemId: { type: 'string' },
    },
    additionalProperties: false,
    required: ['itemId'],
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
