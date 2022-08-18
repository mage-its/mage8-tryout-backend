import express from 'express';

import timeController from '../../controllers/time.controller';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import timeValidation from '../../validations/time.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageTime'),
    validate(timeValidation.createTime),
    timeController.createTime
  )
  .get(
    auth('getTime'),
    validate(timeValidation.getTimes),
    timeController.getTimes
  );

router
  .route('/:timeId')
  .get(
    auth('getTime'),
    validate(timeValidation.getTime),
    timeController.getTime
  )
  .patch(
    auth('manageTime'),
    validate(timeValidation.updateTime),
    timeController.updateTime
  )
  .delete(
    auth('manageTime'),
    validate(timeValidation.deleteTime),
    timeController.deleteTime
  );

export default router;
