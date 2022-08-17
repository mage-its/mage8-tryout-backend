/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { Document, FilterQuery, Types } from 'mongoose';

import SoalInterface from '../interfaces/soal.interface';
import UserInterface from '../interfaces/user.interface';
import { Soal } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

export const createSoal = async (soalBody: SoalInterface) => {
  return Soal.create(soalBody);
};

export const querySoals = async (
  filter: FilterQuery<unknown>,
  options: QueryOption
) => {
  const soals = await Soal.paginate(filter, options);
  return soals;
};

export const getSoalById = async (id: string) => {
  return Soal.findById(id);
};

export const updateSoalById = async (
  soalId: string,
  updateBody: Partial<SoalInterface>
) => {
  const soal = await getSoalById(soalId);
  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }
  Object.assign(soal, updateBody);
  await soal.save();
  return soal;
};

export const userAnswer = async (
  user: Document<unknown, any, UserInterface> &
    UserInterface &
    Required<{
      _id: Types.ObjectId;
    }>,
  soalId: string,
  answer: string
) => {
  const soal = await getSoalById(soalId);

  if (soal?.type !== 'ESAI_PANJANG') {
    if (user.answers?.some(({ id }) => id.toString() === soal?.id.toString())) {
      const userAns = user.answers.find(
        (answer) => answer.id.toString() === soal?._id.toString()
      )?.answer;
      if (answer === userAns) {
        return user;
      }
      user.answers = user.answers.filter(
        ({ id }) => id.toString() !== soal?.id.toString()
      );

      if (userAns === soal?.answer) {
        switch (soal?.difficulty) {
          case 'MUDAH': {
            user.score -= 1;
            break;
          }
          case 'SEDANG': {
            user.score -= 2;
            break;
          }
          case 'SULIT': {
            user.score -= 3;
            break;
          }
          case 'HOTS': {
            user.score -= 4;
            break;
          }
        }
      } else {
        user.score += 1;
      }
    }

    if (answer === soal?.answer) {
      switch (soal.difficulty) {
        case 'MUDAH': {
          user.score += 1;
          break;
        }
        case 'SEDANG': {
          user.score += 2;
          break;
        }
        case 'SULIT': {
          user.score += 3;
          break;
        }
        case 'HOTS': {
          user.score += 4;
          break;
        }
      }
    } else {
      user.score -= 1;
    }
  }

  user.answers?.push({ id: soal?.id, answer: answer });
  await user.save();
  return user;
};

export const userGetSoal = async (user: UserInterface) => {
  if (
    user.role !== 'user' ||
    (user.school.toLowerCase() !== 'sma' && user.school.toLowerCase() !== 'smk')
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Peserta is not valid');
  }

  const aggregateQuery = [
    {
      $match: {
        school: user.school,
      },
    },
  ];

  const soals = await Soal.aggregate<
    SoalInterface & { members: SoalInterface[] }
  >(aggregateQuery);

  return soals.map((soal) => ({
    ...soal,
    answered:
      user.answers?.some(
        (answer) => answer.id.toString() === soal._id?.toString()
      ) ?? false,
  }));
};

export const deleteSoalById = async (soalId: string) => {
  const soal = await getSoalById(soalId);
  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }
  await soal.remove();
  return soal;
};

const soalService = {
  createSoal,
  querySoals,
  getSoalById,
  updateSoalById,
  deleteSoalById,
};

export default soalService;
