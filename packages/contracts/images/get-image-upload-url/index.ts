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

const pathParametersSchema = {
  type: 'object',
  properties: {
    fileName: { type: 'string' },
  },
  additionalProperties: false,
  required: ['fileName'],
} as const satisfies JSONSchema;

export const getImageUploadUrlContract = new ApiGatewayContract({
  id: 'getImageUploadUrl',
  path: '/image/{fileName}',
  method: 'POST',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  //headersSchema,
  requestContextSchema: requestContextSchemaCustom,
  pathParametersSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
      required: ['url'],
      additionalProperties: false,
    } as const,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
