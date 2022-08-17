import httpStatus from 'http-status';

import { QueryOption } from '../models/plugins/paginate.plugin';
import { soalService } from '../services';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';

const createSoal = catchAsync(async (req, res) => {
  const soal = await soalService.createSoal(req.body);
  res.status(httpStatus.CREATED).send(soal);
});

const getSoals = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'school', 'difficulty', 'round']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']) as QueryOption;
  const result = await soalService.querySoals(filter, options);
  res.send(result);
});

const getSoal = catchAsync(async (req, res) => {
  const soal = await soalService.getSoalById(req.params.soalId);
  if (!soal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Soal not found');
  }
  res.send(soal);
});

const updateSoal = catchAsync(async (req, res) => {
  const soal = await soalService.updateSoalById(req.params.soalId, req.body);
  res.send(soal);
});

const deleteSoal = catchAsync(async (req, res) => {
  await soalService.deleteSoalById(req.params.soalId);
  res.status(httpStatus.NO_CONTENT).send();
});

const soalController = {
  createSoal,
  getSoals,
  getSoal,
  updateSoal,
  deleteSoal,
};

export default soalController;
