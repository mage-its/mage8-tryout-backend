import httpStatus from 'http-status';
import { FilterQuery } from 'mongoose';

import SoalInterface from '../interfaces/soal.interface';
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
