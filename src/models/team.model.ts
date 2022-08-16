import { model, Schema } from 'mongoose';

import TeamInterface from '../interfaces/team.interface';
import { toJSON } from './plugins';

const teamSchema = new Schema(
  {
    membersId: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
teamSchema.plugin(toJSON as (schema: Schema) => void);

const Team = model<TeamInterface>('Team', teamSchema);

export default Team;
