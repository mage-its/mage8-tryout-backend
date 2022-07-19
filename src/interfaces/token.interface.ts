import { Types } from 'mongoose';

export interface TokenInterface {
  token: string;
  user: Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default TokenInterface;
