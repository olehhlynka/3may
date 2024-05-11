import { JSONSchema } from 'json-schema-to-ts';

export const errorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
} as const satisfies JSONSchema;
