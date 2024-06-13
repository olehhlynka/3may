import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export const commentSchema = {
  type: 'object',
  properties: {
    _id: { type: 'object' },
    user: {
      type: 'object',
      properties: {
        _id: { type: 'object' },
        username: { type: 'string' },
        photoUrl: { type: 'string' },
      },
      additionalProperties: false,
      required: ['_id', 'username'],
    },
    text: { type: 'string' },
    createdAt: { type: 'object' },
    updatedAt: { type: 'object' },
  },
  additionalProperties: false,
  required: ['user', 'text', 'createdAt', 'updatedAt', '_id'],
} as const satisfies JSONSchema;

export type CommentType = FromSchema<typeof commentSchema>;
