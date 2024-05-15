import { JSONSchema } from 'json-schema-to-ts';

export const requestContextSchema = {
  type: 'object',
  properties: {
    authorizer: {
      type: 'object',
      properties: {
        claims: {
          type: 'object',
          properties: {
            sub: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['sub', 'email'],
        },
      },
      required: ['claims'],
    },
  },
  required: ['authorizer'],
} as const satisfies JSONSchema;
