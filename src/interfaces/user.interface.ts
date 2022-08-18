import { Types } from 'mongoose';

export enum Role {
  admin = 'admin',
  user = 'user',
}

enum School {
  SMA,
  SMK,
}

export interface UserInterface {
  id: string;
  username: string;
  password: string;
  team: Types.ObjectId;
  role?: keyof typeof Role;
  school: keyof typeof School;
  score: number;
  answers?: { id: Types.ObjectId; answer: string }[];
  corrected?: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default UserInterface;
