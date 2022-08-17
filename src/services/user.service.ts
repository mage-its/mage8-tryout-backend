import httpStatus from 'http-status';
import { FilterQuery } from 'mongoose';

import UserInterface from '../interfaces/user.interface';
import { User } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

export const createUser = async (userBody: UserInterface) => {
  if (await User.isUsernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return User.create(userBody);
};

export const queryUsers = async (
  filter: FilterQuery<unknown>,
  options: QueryOption
) => {
  const users = await User.paginate(filter, options);
  return users;
};

export const getUserById = async (id: string) => {
  return User.findById(id);
};

export const getUserByUsername = async (username: string) => {
  return User.findOne({ username });
};

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const updateUserById = async (
  userId: string,
  updateBody: Partial<UserInterface>
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (
    updateBody.username &&
    (await User.isUsernameTaken(updateBody.username, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const userService = {
  createUser,
  queryUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

export default userService;
