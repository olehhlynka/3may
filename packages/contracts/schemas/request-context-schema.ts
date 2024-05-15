import { JSONSchema } from 'json-schema-to-ts';

const claimsSchema = {
  type: 'object',
  properties: {
    sub: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['sub', 'email'],
} as const satisfies JSONSchema;

const jwtSchema = {
  type: 'object',
  properties: {
    claims: claimsSchema,
  },
  required: ['claims'],
} as const satisfies JSONSchema;

const authroizerSchema = {
  type: 'object',
  properties: {
    jwt: jwtSchema,
  },
  required: ['jwt'],
} as const satisfies JSONSchema;

export const requestContextSchemaCustom = {
  type: 'object',
  properties: {
    authorizer: authroizerSchema,
  },
  required: ['authorizer'],
} as const satisfies JSONSchema;
