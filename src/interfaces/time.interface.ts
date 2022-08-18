import { Types } from 'mongoose';

export interface TimeInterface {
  id: Types.ObjectId;
  start: number;
  end: number;
  round: number;
  updatedAt: Date;
  createdAt: Date;
}

export default TimeInterface;
