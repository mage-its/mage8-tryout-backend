import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { User } from '../models';

dotenv.config({ path: path.join(__dirname, '../../.env') });

(async () => {
  await mongoose.connect(process.env.MONGODB_URL as string, {});
  console.log('Connected to MongoDB');
  const users = await User.find({ finished: true });
  console.log('Users found');
  for (const user of users) {
    user.finished = false;
    await user.save();
  }
  console.log('Finished Reset');
  mongoose.disconnect();
})();
