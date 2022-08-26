import express from 'express';

import config from '../../config/config';
import authRoute from './auth.route';
import docsRoute from './docs.route';
import soalRoute from './soal.route';
import teamRoute from './team.route';
import timeRoute from './time.route';
import userRoute from './user.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/team',
    route: teamRoute,
  },
  {
    path: '/soal',
    route: soalRoute,
  },
  {
    path: '/time',
    route: timeRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

router.get('/ping', (req, res) => res.send('PONG'));

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
