import express from 'express';

import soalController from '../../controllers/soal.controller';
import auth from '../../middlewares/auth';
import ensureOneIp from '../../middlewares/ensureOneIp';
import validate from '../../middlewares/validate';
import soalValidation from '../../validations/soal.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageSoals'),
    validate(soalValidation.createSoal),
    soalController.createSoal
  )
  .get(
    auth('getSoals'),
    validate(soalValidation.getSoals),
    soalController.getSoals
  );

router
  .route('/peserta')
  .get(auth(), soalController.getSoalsPeserta)
  .post(
    auth(),
    validate(soalValidation.userAnswer),
    ensureOneIp,
    soalController.userAnswer
  );

router
  .route('/:soalId')
  .get(
    auth('getSoals'),
    validate(soalValidation.getSoal),
    soalController.getSoal
  )
  .patch(
    auth('manageSoals'),
    validate(soalValidation.updateSoal),
    soalController.updateSoal
  )
  .delete(
    auth('manageSoals'),
    validate(soalValidation.deleteSoal),
    soalController.deleteSoal
  );

export default router;
