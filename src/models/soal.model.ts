import { model, Schema } from 'mongoose';

import SoalInterface, {
  Difficulty,
  TipeSoal,
} from '../interfaces/soal.interface';
import { toJSON } from './plugins';

const soalSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    multipleChoice: {
      type: [Schema.Types.ObjectId],
    },
    difficulty: {
      type: Number,
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
      type: Number,
      enum: [TipeSoal.PILGAN, TipeSoal.ESAI_SINGKAT, TipeSoal.ESAI_SINGKAT],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
soalSchema.plugin(toJSON as (schema: Schema) => void);

const Soal = model<SoalInterface>('Soal', soalSchema);

export default Soal;
