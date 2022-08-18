import { FilterQuery, Model, model, Schema } from 'mongoose';

import TimeInterface from '../interfaces/time.interface';
import { toJSON } from './plugins';
import { QueryOption } from './plugins/paginate.plugin';
export interface TimeModel extends Model<TimeInterface, unknown> {
  paginate: (
    filter: FilterQuery<unknown>,
    options: QueryOption
  ) => Promise<void>;
  toJSON: (schema: Schema) => void;
}

const timeSchema = new Schema<TimeInterface, TimeModel>(
  {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
    round: {
      type: Number,
      enum: [1, 2],
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
timeSchema.plugin(toJSON as (schema: Schema) => void);

export const Time = model<TimeInterface, TimeModel>('Time', timeSchema);

export default Time;
