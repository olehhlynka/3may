import { ObjectId } from 'mongodb';

export enum ItemStatus {
  LOST = 'lost',
  FOUND = 'found',
}

export interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface IItem {
  _id: ObjectId;
  user: ObjectId;
  title: string;
  description: string;
  status: ItemStatus;
  location: ILocation;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  photo?: string;
}
