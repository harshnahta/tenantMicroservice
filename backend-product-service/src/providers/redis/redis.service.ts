import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private static _redisClient: RedisClientType | null = null;

  constructor() {
    if (!RedisService._redisClient) {
      RedisService._redisClient = createClient({
        socket: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      });

      RedisService._redisClient.on('connect', () => {
        console.log('✅ Connected to Redis');
      });

      RedisService._redisClient.on('error', (err) => {
        console.error('❌ Redis connection error:', err);
      });
    }
  }

  async onModuleInit() {
    if (RedisService._redisClient && !RedisService._redisClient.isOpen) {
      await RedisService._redisClient.connect();
    }
  }

  async onModuleDestroy() {
    if (RedisService._redisClient && RedisService._redisClient.isOpen) {
      await RedisService._redisClient.disconnect();
      RedisService._redisClient = null;
    }
  }

  get client() {
    return RedisService._redisClient;
  }
}
