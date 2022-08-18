import httpStatus from 'http-status';

import { tokenTypes } from '../config/tokens';
import Token from '../models/token.model';
import ApiError from '../utils/ApiError';
import tokenService from './token.service';
import userService from './user.service';

export const loginUserWithUsernameAndPassword = async (
  username: string,
  password: string
) => {
  const user = await userService.getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Incorrect username or password'
    );
  }
  const returnedUser = {
    ...(user.toObject() as Partial<typeof user>),
  };
  delete returnedUser.score;
  return returnedUser;
};

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  const returnedUser = {
    ...(user.toObject() as Partial<typeof user>),
  };
  delete returnedUser.score;
  return returnedUser;
};

export const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

export const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(
      refreshTokenDoc.user as unknown as string
    );
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

export const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(
      resetPasswordTokenDoc.user as unknown as string
    );
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const authService = {
  loginUserWithUsernameAndPassword,
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
};

export default authService;
