import { Types } from 'mongoose';

import { School } from './soal.interface';

export interface TeamInterface {
  membersId: Types.ObjectId[];
  name: string;
  phone: string;
  school: string;
  schoolType: School;
  email: string;
  score: number;
  pass: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default TeamInterface;
