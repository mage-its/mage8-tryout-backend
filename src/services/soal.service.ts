/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chance } from 'chance';
import httpStatus from 'http-status';
import moment from 'moment';
import { Document, FilterQuery, Types } from 'mongoose';

import { redis } from '../config/redis';
import SoalInterface from '../interfaces/soal.interface';
import UserInterface from '../interfaces/user.interface';
import { Soal, Time } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

export const createSoal = async (soalBody: SoalInterface) => {
  const soal = await Soal.create(soalBody);

  redis?.del('SOAL');

  return soal;
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
  redis?.del('SOAL');
  return soal;
};

export const userAnswer = async (
  user: Document<unknown, any, UserInterface> &
    UserInterface &
    Required<{
      _id: Types.ObjectId;
    }>,
  soalId: string,
  answer?: string
) => {
  const soal = await getSoalById(soalId);

  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }

  const time = await Time.findOne({ round: soal.round });

  const curTime = moment().valueOf();

  if (!time) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Time not found');
  }

  if (!(time.start < curTime && time.end > curTime)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      `Exam has ${curTime < time.start ? 'not started' : 'ended'}`
    );
  }

  if (soal?.type !== 'ESAI_PANJANG') {
    if (user.answers?.some(({ id }) => id.toString() === soal?.id.toString())) {
      const userAns = user.answers.find(
        (answer) => answer.id.toString() === soal?._id.toString()
      )?.answer;
      if (answer === userAns) {
        const { _id, ...returnedUser } = {
          ...(user.toObject() as Partial<typeof user>),
        };
        // delete returnedUser.score;
        delete returnedUser.password;
        returnedUser.id = _id;
        return returnedUser;
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

    if (answer) {
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
      user.answers?.push({ id: soal?.id, answer: answer, round: soal.round });
    }
  }

  await user.save();
  const { _id, ...returnedUser } = {
    ...(user.toObject() as Partial<typeof user>),
  };
  delete returnedUser.score;
  delete returnedUser.password;
  returnedUser.id = _id;
  return returnedUser;
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
    {
      $unset: 'answer',
    },
  ];

  const cachedSoal = await redis?.get('SOAL');

  let soals: (SoalInterface & {
    members: SoalInterface[];
  })[];

  if (cachedSoal) {
    soals = JSON.parse(cachedSoal);
  } else {
    soals = await Soal.aggregate<SoalInterface & { members: SoalInterface[] }>(
      aggregateQuery
    );
    redis?.set('SOAL', JSON.stringify(soals), 'EX', 60 * 60);
  }

  const chance = new Chance(user.id);

  const returnSoals: typeof soals = chance.shuffle(
    soals.map((soal) => ({
      ...soal,
      answered:
        user.answers?.some(
          (answer) => answer.id.toString() === soal._id?.toString()
        ) ?? false,
    }))
  );

  return returnSoals;
};

export const deleteSoalById = async (soalId: string) => {
  const soal = await getSoalById(soalId);
  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }
  await soal.remove();
  redis?.del('SOAL');
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
