import { Types } from 'mongoose';

export enum Role {
  ADMIN = 'admin',
  USER = 'user,',
}

export interface UserInterface {
  id: string;
  username: string;
  password: string;
  team: Types.ObjectId;
  role?: Role;
  school: 'SMA' | 'SMK';
  score?: number;
  answers?: { id: Types.ObjectId; answer: string }[];
  updatedAt: Date;
  createdAt: Date;
}

export default UserInterface;
