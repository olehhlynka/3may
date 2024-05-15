import { JSONSchema } from 'json-schema-to-ts';

export const requestContextSchema = {
  type: 'object',
  properties: {
    authorizer: { type: 'string' },
  },
  required: ['authorizer'],
} as const satisfies JSONSchema;
