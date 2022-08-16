import { FilterQuery, Model, model, Schema } from 'mongoose';

import TeamInterface from '../interfaces/team.interface';
import { paginate, toJSON } from './plugins';
import { QueryOption } from './plugins/paginate.plugin';

export interface TeamModel extends Model<TeamInterface, unknown> {
  paginate: (
    filter: FilterQuery<unknown>,
    options: QueryOption
  ) => Promise<void>;
  toJSON: (schema: Schema) => void;
}

const teamSchema = new Schema<TeamInterface, TeamModel>(
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
teamSchema.plugin(paginate);

const Team = model<TeamInterface, TeamModel>('Team', teamSchema);

export default Team;
