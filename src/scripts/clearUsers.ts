import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { User } from '../models';

dotenv.config({ path: path.join(__dirname, '../../.env') });

(async () => {
  await mongoose.connect(process.env.MONGODB_URL as string, {});
  console.log('Connected to MongoDB');
  await User.deleteMany({ username: { $ne: 'admin' } });
  console.log('Users purged');
  mongoose.disconnect();
})();
