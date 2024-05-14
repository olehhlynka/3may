import { JSONSchema } from 'json-schema-to-ts';

export const commentSchema = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    text: { type: 'string' },
  },
  additionalProperties: false,
  required: ['user', 'text'],
} as const satisfies JSONSchema;
