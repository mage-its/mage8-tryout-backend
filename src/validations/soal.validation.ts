import Joi from 'joi';

import { objectId } from './custom.validation';

const createSoal = {
  body: Joi.object().keys({
    question: Joi.string().required(),
    multipleChoice: Joi.array().items(Joi.string()),
    type: Joi.string().required(),
    difficulty: Joi.string().required(),
    school: Joi.string().required(),
    round: Joi.number().required(),
    answer: Joi.string().required(),
  }),
};

const userAnswer = {
  body: Joi.object().keys({
    soalId: Joi.string().required(),
    answer: Joi.string().min(1),
  }),
};

const getSoals = {
  query: Joi.object().keys({
    type: Joi.string(),
    school: Joi.string(),
    difficulty: Joi.string(),
    round: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSoal = {
  params: Joi.object().keys({
    soalId: Joi.string().custom(objectId),
  }),
};

const updateSoal = {
  params: Joi.object().keys({
    soalId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      question: Joi.string(),
      multipleChoice: Joi.array().items(Joi.string()),
      type: Joi.string(),
      difficulty: Joi.string(),
      school: Joi.string(),
      round: Joi.number(),
      answer: Joi.string(),
    })
    .min(1),
};

const deleteSoal = {
  params: Joi.object().keys({
    soalId: Joi.string().custom(objectId),
  }),
};

const soalValidation = {
  createSoal,
  userAnswer,
  getSoals,
  getSoal,
  updateSoal,
  deleteSoal,
};

export default soalValidation;
