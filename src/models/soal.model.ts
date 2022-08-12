import { model, Schema, SchemaTypes } from 'mongoose';

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
      type: [String],
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
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
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
