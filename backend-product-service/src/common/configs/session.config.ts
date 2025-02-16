import { REDIS_AUTH_TOKEN_SESSION } from 'src/providers/redis/redis.constant';
import { envConfig } from './env.config';
import RedisStore from 'connect-redis';
import { RedisService } from '@providers/redis/redis.service';

export const sessionConfig = (redisService: RedisService) => {
  const redisClient = redisService.client; // Reuse existing Redis client
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'SEQ:',
  });

  return {
    store: redisStore,
    name: REDIS_AUTH_TOKEN_SESSION,
    secret: envConfig().secret,
    resave: false,
    saveUninitialized: false,
  };
};
