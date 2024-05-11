import { ItemStatus } from '@3may/types';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { locationSchema } from './location-schema';

export const itemSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    status: { type: 'string', enum: Object.values(ItemStatus) },
    description: { type: 'string' },
    photo: { type: 'string' },
    location: locationSchema,
    user: { type: 'object' }, //TODO: provide context
    date: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
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
