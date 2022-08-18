import Redis from 'ioredis';

import logger from './logger';

export let redis: Redis | null = new Redis();

redis.on('error', (err) => {
  logger.error(err.message);
  if (err.code === 'ECONNREFUSED') {
    redis?.disconnect();
    logger.error('Redis connection refused, exiting...');
    redis = null;
  }
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});
