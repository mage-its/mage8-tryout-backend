import { Types } from 'mongoose';

export enum Role {
  admin = 'admin',
  user = 'user',
}

enum School {
  SMA,
  SMK,
}

export enum Verdict {
  CORRECT,
  INCORRECT,
}

export type Answer = {
  id: Types.ObjectId;
  answer: string;
  round: number;
  verdict?: keyof typeof Verdict;
};

export interface UserInterface {
  id: string;
  _id: string;
  username: string;
  password: string;
  team: Types.ObjectId;
  role?: keyof typeof Role;
  school: keyof typeof School;
  score: {
    [key: string]: number;
  };
  answers?: Answer[];
  corrected?: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default UserInterface;
