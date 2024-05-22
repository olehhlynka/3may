import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
    cognitoId: { type: 'string' },
    email: { type: 'string' },
    rating: { type: 'number' },
    photoUrl: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  //additionalProperties: false,
  required: ['_id', 'username', 'email', 'cognitoId', 'createdAt', 'updatedAt'],
} as const satisfies JSONSchema;

export type UserType = FromSchema<typeof userSchema>;
