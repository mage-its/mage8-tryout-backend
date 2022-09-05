/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, {
  Aggregate,
  AggregatePaginateResult,
  FilterQuery,
  Model,
  model,
  PaginateOptions,
  Schema,
} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import TeamInterface from '../interfaces/team.interface';
import { paginate, toJSON } from './plugins';
import { QueryOption } from './plugins/paginate.plugin';

export interface TeamModel extends Model<TeamInterface, unknown> {
  isTeamnameTaken(name: string, excludeTeamId?: string): Promise<boolean>;
  paginate: (
    filter: FilterQuery<unknown>,
    options: QueryOption
  ) => Promise<void>;
  toJSON: (schema: Schema) => void;
  aggregatePaginate: <T>(
    query?: Aggregate<T[]>,
    options?: PaginateOptions,
    callback?: (err: any, result: AggregatePaginateResult<T>) => void
  ) => Promise<AggregatePaginateResult<T>>;
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
    schoolType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pass: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
teamSchema.plugin(toJSON as (schema: Schema) => void);
teamSchema.plugin(paginate);
teamSchema.plugin(aggregatePaginate);

teamSchema.statics.isTeamnameTaken = async function (
  name: string,
  excludeTeamId?: string
) {
  const team = await this.findOne({
    name,
    _id: mongoose.trusted({ $ne: excludeTeamId }),
  });
  return !!team;
};

export const Team = model<TeamInterface, TeamModel>('Team', teamSchema);

export default Team;
