import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    rating: { type: 'number' },
    photo: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  additionalProperties: false,
  required: ['_id', 'name', 'rating', 'photo'],
} as const satisfies JSONSchema;

export type UserType = FromSchema<typeof userSchema>;
