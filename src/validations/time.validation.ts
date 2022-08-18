import Joi from 'joi';

import { objectId } from './custom.validation';

const createTime = {
  body: Joi.object().keys({
    start: Joi.number().required(),
    end: Joi.number().required(),
    round: Joi.number().required().valid(1, 2),
  }),
};

const getTimes = {
  query: Joi.object().keys({
    round: Joi.number().valid(1, 2),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTime = {
  params: Joi.object().keys({
    timeId: Joi.string().custom(objectId),
  }),
};

const updateTime = {
  params: Joi.object().keys({
    timeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      start: Joi.number(),
      end: Joi.number(),
      round: Joi.number().valid(1, 2),
    })
    .min(1),
};

const deleteTime = {
  params: Joi.object().keys({
    timeId: Joi.string().custom(objectId),
  }),
};

const timeValidation = {
  createTime,
  getTimes,
  getTime,
  updateTime,
  deleteTime,
};

export default timeValidation;
