import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { Team } from '../models';

dotenv.config({ path: path.join(__dirname, '../../.env') });

(async () => {
  await mongoose.connect(process.env.MONGODB_URL as string, {});
  console.log('Connected to MongoDB');
  const teams = await Team.find({ pass: false });
  console.log('Teams found');
  for (const team of teams) {
    team.pass = true;
    await team.save();
  }
  console.log('Finished Set All Team Pass');
  mongoose.disconnect();
})();
