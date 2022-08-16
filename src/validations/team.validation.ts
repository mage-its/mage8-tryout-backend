import Joi from 'joi';

import { password } from './custom.validation';

const register = {
  body: Joi.object().keys({
    user1: Joi.object().keys({
      password: Joi.string().required().custom(password),
      username: Joi.string().required(),
    }),
    user2: Joi.object().keys({
      password: Joi.string().required().custom(password),
      username: Joi.string().required(),
    }),
    user3: Joi.object().keys({
      password: Joi.string().required().custom(password),
      username: Joi.string().required(),
    }),
    team: Joi.object().keys({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      school: Joi.string().required(),
      email: Joi.string().required(),
    }),
  }),
};

const getTeamByName = {
  query: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getTeams = {
  query: Joi.object().keys({
    name: Joi.string(),
    school: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const teamValidation = {
  register,
  getTeamByName,
  getTeams,
};

export default teamValidation;
