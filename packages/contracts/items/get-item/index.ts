import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { JSONSchema } from 'json-schema-to-ts';
import { errorSchema } from '../../schemas/error-schema';
import { itemSchema, requestContextSchemaCustom } from '../..';

const pathParametersSchema = {
  type: 'object',
  properties: {
    itemId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['itemId'],
} as const satisfies JSONSchema;

export const getSingleItemContract = new ApiGatewayContract({
  id: 'getSingleItem',
  path: '/items/{itemId}',
  method: 'GET',
  integrationType: 'restApi',
  authorizerType: 'cognito',
  pathParametersSchema,
  requestContextSchema: requestContextSchemaCustom,
  outputSchemas: {
    [HttpStatusCodes.OK]: itemSchema,
    [HttpStatusCodes.BAD_GATEWAY]: errorSchema,
    [HttpStatusCodes.BAD_REQUEST]: errorSchema,
  } as const,
});
