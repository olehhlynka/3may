import { ItemStatus } from '@3may/types';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { locationSchema } from './location-schema';
import { commentSchema } from './comment-schema';

export const itemSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    status: { type: 'string', enum: Object.values(ItemStatus) },
    description: { type: 'string' },
    photo: { type: 'string' },
    location: locationSchema,
    user: { type: 'string' },
    date: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    comments: { type: 'array', items: commentSchema },
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
  ],
} as const satisfies JSONSchema;

export type ItemType = FromSchema<typeof itemSchema>;
