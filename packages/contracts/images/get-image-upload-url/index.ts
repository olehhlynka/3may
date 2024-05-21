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

const queryStringParametersSchema = {
  type: 'object',
  properties: {
    profile: { type: 'string' },
  },
  additionalProperties: false,
} as const satisfies JSONSchema;

export const getImageUploadUrlContract = new ApiGatewayContract({
  id: 'getImageUploadUrl',
  path: '/images/{fileName}',
  method: 'POST',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  //headersSchema,
  requestContextSchema: requestContextSchemaCustom,
  pathParametersSchema,
  queryStringParametersSchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        presignedPost: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            field: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                },
                bucket: { type: 'string' },
                'X-Amz-Algorithm': { type: 'string' },
                'X-Amz-Credential': { type: 'string' },
                'X-Amz-Date': { type: 'string' },
                'X-Amz-Security-Token': { type: 'string' },
                Policy: { type: 'string' },
                'X-Amz-Signature': { type: 'string' },
              },
              required: [
                'key',
                'bucket',
                'X-Amz-Algorithm',
                'X-Amz-Credential',
                'X-Amz-Date',
                'X-Amz-Security-Token',
                'Policy',
                'X-Amz-Signature',
              ],
              additionalProperties: false,
            },
          },
        },
      },
      required: ['url', 'presignedPost'],
      additionalProperties: false,
    } as const,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
  } as const,
});
