import Joi from 'joi';

import { objectId, password } from './custom.validation';

const register = {
  body: Joi.object().keys({
    user1: Joi.object().keys({
      password: Joi.string().required().custom(password),
      username: Joi.string().required(),
      school: Joi.string().required(),
    }),
    user2: Joi.object().keys({
      password: Joi.string().required().custom(password),
      username: Joi.string().required(),
      school: Joi.string().required(),
    }),
    user3: Joi.object().keys({
      password: Joi.string().required().custom(password),
      username: Joi.string().required(),
      school: Joi.string().required(),
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

const getTeamById = {
  params: Joi.object().keys({
    teamId: Joi.string().custom(objectId),
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

const updateTeam = {
  params: Joi.object().keys({
    teamId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      phone: Joi.string(),
      school: Joi.string(),
      email: Joi.string(),
    })
    .min(1),
};

const deleteTeam = {
  params: Joi.object().keys({
    teamId: Joi.string().custom(objectId),
  }),
};

const teamValidation = {
  register,
  getTeamByName,
  getTeamById,
  getTeams,
  updateTeam,
  deleteTeam,
};

export default teamValidation;
