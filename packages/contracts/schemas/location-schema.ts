import { JSONSchema } from 'json-schema-to-ts';

export const locationSchema = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    coordinates: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  additionalProperties: false,
  required: ['type', 'coordinates'],
} as const satisfies JSONSchema;
