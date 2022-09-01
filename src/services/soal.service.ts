/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chance } from 'chance';
import httpStatus from 'http-status';
import moment from 'moment';
import mongoose, { Document, FilterQuery, Types } from 'mongoose';

import { redis } from '../config/redis';
import SoalInterface from '../interfaces/soal.interface';
import UserInterface, { Verdict } from '../interfaces/user.interface';
import { Soal, Time, UserMethods } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

export const createSoal = async (soalBody: SoalInterface) => {
  const soal = await Soal.create(soalBody);

  const keys = await redis?.keys('SOAL*');
  keys && redis?.del(keys);

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
  const keys = await redis?.keys('SOAL*');
  keys && redis?.del(keys);
  return soal;
};

export const userAnswer = async (
  user: Document<unknown, any, UserInterface> &
    UserInterface &
    Required<{
      _id: Types.ObjectId;
    }>,
  ip: string,
  soalId: string,
  answerInput?: string
) => {
  if (user.finished) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User has finished the exam');
  }

  const soal = await getSoalById(soalId);

  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }

  const cachedTime = await redis?.get(`TIME-${soal.round}`);

  const time = cachedTime
    ? JSON.parse(cachedTime)
    : await Time.findOne({ round: soal.round });

  if (!time) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Time not found');
  }

  if (!cachedTime) {
    await redis?.set(`TIME-${time.round}`, JSON.stringify(time), 'EX', 60 * 60);
  }

  const curTime = moment().valueOf();

  if (!(time.start < curTime && time.end > curTime)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      `Exam has ${curTime < time.start ? 'not started' : 'ended'}`
    );
  }

  const { round } = soal;

  if (soal?.type !== 'ESAI_PANJANG') {
    if (user.answers?.some(({ id }) => id.toString() === soal?.id.toString())) {
      const userAns = user.answers.find(
        (answer) => answer.id.toString() === soal?._id.toString()
      )?.answer;
      if (answerInput === userAns) {
        const { _id, ...returnedUser } = {
          ...(user.toObject() as Partial<typeof user>),
        };
        delete returnedUser.score_1;
        delete returnedUser.score_2;
        delete returnedUser.password;
        returnedUser.id = _id;
        returnedUser.answers = returnedUser.answers?.map((answer) => {
          const newAnswer = { ...answer };
          delete newAnswer.verdict;
          return newAnswer;
        });
        return returnedUser;
      }
      user.answers = user.answers.filter(
        ({ id }) => id.toString() !== soal?.id.toString()
      );

      if (userAns === soal?.answer) {
        switch (soal?.difficulty) {
          case 'MUDAH': {
            if (round === 1) {
              user.score_1 -= 1;
            } else {
              user.score_2 -= 1;
            }
            break;
          }
          case 'SEDANG': {
            if (round === 1) {
              user.score_1 -= 2;
            } else {
              user.score_2 -= 2;
            }
            break;
          }
          case 'SULIT': {
            if (round === 1) {
              user.score_1 -= 3;
            } else {
              user.score_2 -= 3;
            }
            break;
          }
          case 'HOTS': {
            if (round === 1) {
              user.score_1 -= 4;
            } else {
              user.score_2 -= 4;
            }
            break;
          }
        }
      } else {
        if (round === 1) {
          user.score_1 += 1;
        } else {
          user.score_2 += 1;
        }
      }
    }

    if (answerInput) {
      let verdict: keyof typeof Verdict;
      if (answerInput === soal?.answer) {
        switch (soal.difficulty) {
          case 'MUDAH': {
            if (round === 1) {
              user.score_1 += 1;
            } else {
              user.score_2 += 1;
            }
            break;
          }
          case 'SEDANG': {
            if (round === 1) {
              user.score_1 += 2;
            } else {
              user.score_2 += 2;
            }
            break;
          }
          case 'SULIT': {
            if (round === 1) {
              user.score_1 += 3;
            } else {
              user.score_2 += 3;
            }
            break;
          }
          case 'HOTS': {
            if (round === 1) {
              user.score_1 += 4;
            } else {
              user.score_2 += 4;
            }
            break;
          }
        }
        verdict = 'CORRECT';
      } else {
        if (round === 1) {
          user.score_1 -= 1;
        } else {
          user.score_2 -= 1;
        }
        verdict = 'INCORRECT';
      }

      if (!user.answers) {
        user.answers = [
          {
            id: soal?.id,
            answer: answerInput,
            round: soal.round,
            verdict,
          },
        ];
      } else {
        user.answers?.push({
          id: soal?.id,
          answer: answerInput,
          round: soal.round,
          verdict,
        });
      }
    }
  } else if (answerInput) {
    // ESAI_PANJANG
    if (user.answers) {
      user.answers = user.answers.filter(
        ({ id }) => id.toString() !== soal?.id.toString()
      );
      user.answers?.push({
        id: soal?.id,
        answer: answerInput,
        round: soal.round,
      });
    } else {
      user.answers = [
        {
          id: soal?.id,
          answer: answerInput,
          round: soal.round,
        },
      ];
    }
  } else {
    // ESAI_PANJANG NO INPUT
    if (user.answers) {
      user.answers = user.answers.filter(
        ({ id }) => id.toString() !== soal?.id.toString()
      );
    }
  }

  await user.save();
  const { _id, ...returnedUser } = {
    ...(user.toObject() as Partial<typeof user>),
  };
  delete returnedUser.score_1;
  delete returnedUser.score_2;
  delete returnedUser.password;
  returnedUser.id = _id;
  returnedUser.answers = returnedUser.answers?.map((answer) => {
    const newAnswer = { ...answer };
    delete newAnswer.verdict;
    return newAnswer;
  });
  return returnedUser;
};

export const userGetSoal = async (user: UserInterface) => {
  if (
    user.role !== 'user' ||
    (user.school.toLowerCase() !== 'sma' && user.school.toLowerCase() !== 'smk')
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Peserta is not valid');
  }

  if (user.finished) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User has finished the exam');
  }

  const curTime = moment().valueOf();

  const time = await Time.findOne({
    start: mongoose.trusted({ $lte: curTime }),
    end: mongoose.trusted({ $gte: curTime }),
  });

  if (!time) {
    throw new ApiError(httpStatus.FORBIDDEN, 'No exam at the moment');
  }

  const aggregateQuery = [
    {
      $match: {
        school: user.school,
        round: time.round,
      },
    },
    {
      $unset: 'answer',
    },
  ];

  const cachedSoal = await redis?.get(`SOAL-${time.round}`);

  let soals: (SoalInterface & {
    members: SoalInterface[];
  })[];

  if (cachedSoal) {
    soals = JSON.parse(cachedSoal);
  } else {
    soals = await Soal.aggregate<SoalInterface & { members: SoalInterface[] }>(
      aggregateQuery
    );
    redis?.set(`SOAL-${time.round}`, JSON.stringify(soals), 'EX', 60 * 60);
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

export const userFinished = async (
  user:
    | (mongoose.Document<unknown, any, UserInterface> &
        UserInterface &
        Required<{
          _id: string;
        }> &
        UserMethods)
    | null
) => {
  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  if (
    user.role !== 'user' ||
    (user.school.toLowerCase() !== 'sma' && user.school.toLowerCase() !== 'smk')
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Peserta is not valid');
  }

  user.finished = true;
  return user.save();
};

export const deleteSoalById = async (soalId: string) => {
  const soal = await getSoalById(soalId);
  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }
  await soal.remove();
  const keys = await redis?.keys('SOAL*');
  keys && redis?.del(keys);
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
