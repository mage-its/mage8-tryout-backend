import { model, Schema } from 'mongoose';

import TimeInterface from '../interfaces/time.interface';
import { toJSON } from './plugins';

const timeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['start', 'end'],
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
timeSchema.plugin(toJSON as (schema: Schema) => void);

export const Time = model<TimeInterface>('Time', timeSchema);

export default Time;
