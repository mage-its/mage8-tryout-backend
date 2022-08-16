import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { Token } from '../models';

dotenv.config({ path: path.join(__dirname, '../../.env') });

(async () => {
  await mongoose.connect(process.env.MONGODB_URL as string, {});
  console.log('Connected to MongoDB');
  await Token.deleteMany({});
  console.log('Tokens purged');
  mongoose.disconnect();
})();
