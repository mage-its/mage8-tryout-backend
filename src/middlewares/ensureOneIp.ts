import httpStatus from 'http-status';

import { redis } from '../config/redis';
import UserInterface from '../interfaces/user.interface';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

const ensureOneIp = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }

  const redisUser = await redis?.get((req.user as UserInterface).id);
  if (redisUser && req.ip !== redisUser) {
    return next(
      new ApiError(
        httpStatus.FORBIDDEN,
        'Max login reached, please logout from another device'
      )
    );
  }
  await redis?.set((req.user as UserInterface).id, req.ip, 'EX', 60 * 60 * 3);
  return next();
});

export default ensureOneIp;
