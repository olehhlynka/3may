import { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  allowNotifications: boolean;
  cognitoId: string;
  createdAt: Date;
  updatedAt: Date;
}
