import Redis from 'ioredis';

const redis = new Redis();

(async () => {
  if (!redis) return;
  const keys = await redis?.keys('*');
  await redis.del(keys);
  redis.disconnect();
})();
