import { ItemStatus } from '@3may/types';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { locationSchema } from './location-schema';
import { commentSchema } from './comment-schema';

export const itemSchema = {
  type: 'object',
  properties: {
    _id: { type: 'object' },
    title: { type: 'string' },
    status: { type: 'string', enum: Object.values(ItemStatus) },
    description: { type: 'string' },
    photo: { type: 'string' },
    location: locationSchema,
    user: {
      type: 'object',
      properties: {
        _id: { type: 'object' },
        name: { type: 'string' },
        email: { type: 'string' },
        photoUrl: { type: 'string' },
      },
      additionalProperties: false,
      required: ['email', '_id'],
    },
    date: { type: 'object' },
    tags: { type: 'array', items: { type: 'string' } },
    comments: { type: 'array', items: commentSchema },
    createdAt: { type: 'object' },
    updatedAt: { type: 'object' },
  },
  additionalProperties: false,
  required: [
    '_id',
    'title',
    'description',
    'date',
    'status',
    'user',
    'location',
    'createdAt',
    'updatedAt',
  ],
} as const satisfies JSONSchema;

export type ItemType = FromSchema<typeof itemSchema>;
