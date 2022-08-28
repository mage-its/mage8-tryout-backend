import { FilterQuery, Model, model, Schema } from 'mongoose';

import SoalInterface, {
  Difficulty,
  TipeSoal,
} from '../interfaces/soal.interface';
import { paginate, toJSON } from './plugins';
import { QueryOption } from './plugins/paginate.plugin';

export interface SoalModel extends Model<SoalInterface, unknown> {
  paginate: (
    filter: FilterQuery<unknown>,
    options: QueryOption
  ) => Promise<void>;
  toJSON: (schema: Schema) => void;
}

const soalSchema = new Schema<SoalInterface, SoalModel>(
  {
    question: {
      type: String,
      required: true,
    },
    multipleChoice: {
      type: [String],
    },
    difficulty: {
      type: String,
      required: true,
      enum: [
        Difficulty.MUDAH,
        Difficulty.SEDANG,
        Difficulty.SULIT,
        Difficulty.HOTS,
      ],
    },
    school: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    round: {
      type: Number,
      required: true,
      default: 1,
    },
    type: {
      type: String,
      enum: [TipeSoal.PILGAN, TipeSoal.ESAI_SINGKAT, TipeSoal.ESAI_PANJANG],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
soalSchema.plugin(toJSON as (schema: Schema) => void);
soalSchema.plugin(paginate);

export const Soal = model<SoalInterface, SoalModel>('Soal', soalSchema);

export default Soal;
