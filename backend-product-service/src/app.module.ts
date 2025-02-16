import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { envConfig } from '@common/configs/env.config';

import { AuthModule } from '@modules/auth/auth.module';
import { ProductModule } from '@modules/product/product.module';

import { PrismaModule } from '@providers/prisma/prisma.module';
import { RedisModule } from '@providers/redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@modules/auth/guards/auth.jwt.guards';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require('cache-manager-redis-store');
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/mymetrics',
    }),
    CacheModule.register({
      store: redisStore,
      ...envConfig().redis,
      // isGlobal: true,
    }),
    PrismaModule,
    ProductModule,
    AuthModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => envConfig()] }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    PrismaSelectService,
  ],
})
export class AppModule {}
