import { Types } from 'mongoose';

export interface TimeInterface {
  id: Types.ObjectId;
  type: 'start' | 'end';
  round: number;
  value: number;
  updatedAt: Date;
  createdAt: Date;
}

export default TimeInterface;
