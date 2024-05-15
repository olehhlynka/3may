import { JSONSchema } from 'json-schema-to-ts';

const claimsSchema = {
  type: 'object',
  properties: {
    sub: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['sub', 'email'],
} as const satisfies JSONSchema;

export const authroizerSchema = {
  type: 'object',
  properties: {
    claims: claimsSchema,
  },
  required: ['claims'],
} as const satisfies JSONSchema;

export const requestContextSchema = {
  type: 'object',
  properties: {
    authorizer: authroizerSchema,
  },
  required: ['authorizer'],
} as const satisfies JSONSchema;
