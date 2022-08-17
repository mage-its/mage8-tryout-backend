import { Types } from 'mongoose';

export enum Difficulty {
  MUDAH = 'MUDAH',
  SEDANG = 'SEDANG',
  SULIT = 'SULIT',
  HOTS = 'HOTS',
}

export enum TipeSoal {
  PILGAN = 'PILGAN',
  ESAI_SINGKAT = 'ESAI_SINGKAT',
  ESAI_PANJANG = 'ESAI_PANJANG',
}

export enum School {
  sma = 'SMA',
  smk = 'SMK',
}
export interface SoalInterface {
  _id?: Types.ObjectId;
  id: Types.ObjectId;
  question: string;
  multipleChoice?: string[];
  type: keyof typeof TipeSoal;
  difficulty: keyof typeof Difficulty;
  school: `${School}`;
  round: number;
  answer: string;
  updatedAt: Date;
  createdAt: Date;
}

export default SoalInterface;
