import { Types } from 'mongoose';

export interface TeamInterface {
  membersId: Types.ObjectId[];
  name: string;
  phone: string;
  school: string;
  email: string;
  score: number;
  updatedAt: Date;
  createdAt: Date;
}

export default TeamInterface;
