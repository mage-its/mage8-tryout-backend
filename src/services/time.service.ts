import httpStatus from 'http-status';
import { FilterQuery } from 'mongoose';

import TimeInterface from '../interfaces/time.interface';
import { Time } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

export const createTime = async (timeBody: TimeInterface) => {
  return Time.create(timeBody);
};

export const queryTimes = async (
  filter: FilterQuery<unknown>,
  options: QueryOption
) => {
  const times = await Time.paginate(filter, options);
  return times;
};

export const getTimeById = async (id: string) => {
  return Time.findById(id);
};

export const updateTimeById = async (
  timeId: string,
  updateBody: Partial<TimeInterface>
) => {
  const time = await getTimeById(timeId);
  if (!time) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time not found');
  }
  Object.assign(time, updateBody);
  await time.save();
  return time;
};

export const deleteTimeById = async (timeId: string) => {
  const time = await getTimeById(timeId);
  if (!time) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time not found');
  }
  await time.remove();
  return time;
};

const timeService = {
  createTime,
  queryTimes,
  getTimeById,
  updateTimeById,
  deleteTimeById,
};

export default timeService;
