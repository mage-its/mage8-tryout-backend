import httpStatus from 'http-status';

import { QueryOption } from '../models/plugins/paginate.plugin';
import { timeService } from '../services';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';

const createTime = catchAsync(async (req, res) => {
  const time = await timeService.createTime(req.body);
  res.status(httpStatus.CREATED).send(time);
});

const getTimes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['round']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']) as QueryOption;
  const result = await timeService.queryTimes(filter, options);
  res.send(result);
});

const getTime = catchAsync(async (req, res) => {
  const time = await timeService.getTimeById(req.params.timeId);
  if (!time) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time not found');
  }
  res.send(time);
});

const updateTime = catchAsync(async (req, res) => {
  const time = await timeService.updateTimeById(req.params.timeId, req.body);
  res.send(time);
});

const deleteTime = catchAsync(async (req, res) => {
  await timeService.deleteTimeById(req.params.timeId);
  res.status(httpStatus.NO_CONTENT).send();
});

const timeController = {
  createTime,
  getTimes,
  getTime,
  updateTime,
  deleteTime,
};

export default timeController;
