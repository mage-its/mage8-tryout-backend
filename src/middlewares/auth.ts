/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';

import { roleRights } from '../config/roles';
import UserInterface, { Role } from '../interfaces/user.interface';
import ApiError from '../utils/ApiError';

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void,
    requiredRights: string[]
  ) =>
  async (err: Error, user: UserInterface, info: any) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role as Role);
      const hasRequiredRights = requiredRights.every(
        (requiredRight) =>
          userRights && (userRights as string[]).includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
