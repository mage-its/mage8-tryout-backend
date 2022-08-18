import Joi from 'joi';

import { objectId, password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
    school: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      password: Joi.string().custom(password),
      username: Joi.string(),
      school: Joi.string(),
      corrected: Joi.boolean(),
      role: Joi.string().valid('user', 'admin'),
      score: Joi.number(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const userValidation = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

export default userValidation;
