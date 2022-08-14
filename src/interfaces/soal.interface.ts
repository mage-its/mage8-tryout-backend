import { Types } from 'mongoose';

export enum Difficulty {
  MUDAH,
  SEDANG,
  SULIT,
  HOTS,
}

export enum TipeSoal {
  PILGAN,
  ESAI_SINGKAT,
  ESAI_PANJANG,
}

export interface SoalInterface {
  id: Types.ObjectId;
  question: string;
  multipleChoice?: string[];
  type: TipeSoal;
  difficulty: Difficulty;
  school: 'SMA' | 'SMK';
  round: number;
  answer: string;
  updatedAt: Date;
  createdAt: Date;
}

export default SoalInterface;
