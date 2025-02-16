import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { translateErrors } from '@common/global-exceptions-filter/transform-errors';
import { envConfig } from '@common/configs/env.config';

import { sessionConfig } from '@common/configs/session.config';

import { setupSwagger } from '@common/configs/swagger.config';
import passport from 'passport';

import { AllExceptionsFilter } from '@common/global-exceptions-filter/all-exceptions.filter';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
// import csurf from 'csurf';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import moment from 'moment-timezone';
import { join } from 'path';
import { create } from 'express-handlebars';
import { RedisService } from '@providers/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const env = envConfig();

  moment.tz.setDefault('Asia/Kolkata');

  app.use('/public', express.static(join(__dirname, '..', '..', 'public')));
  app.enableCors({
    credentials: true,
  });
  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  app.use(express.json());

  // if (env.isProduction) {
  // app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(compression());
  app.use(helmet());

  app.use(
    RateLimit({
      windowMs: 1 * 30 * 1000, // 30 sec
      max: 1000, // limit each IP to 300 requests per windowMs
    }),
  );
  // }

  const redisService = app.get(RedisService);

  app.use(session(sessionConfig(redisService)));
  app.use(passport.initialize());
  app.use(passport.session());
  app.useStaticAssets(join(__dirname, '..', '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'src', 'views'));
  // app.use(csurf());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      validationError: {
        target: false,
      },
      exceptionFactory: translateErrors,
      forbidUnknownValues: false,
    }),
  );
  // app.useGlobalInterceptors(new ErrorsInterceptor());
  // Custom exceptions filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setupSwagger(app);
  // Create `ExpressHandlebars` instance with a default layout.
  const hbs = create({
    extname: 'hbs',
    defaultLayout: 'layout_main',
    layoutsDir: join(__dirname, '..', '..', 'src', 'views', 'layouts'),
    partialsDir: join(__dirname, '..', '..', 'src', 'views', 'partials'),
    // helpers: { printName },
  });
  app.engine('hbs', hbs.engine);

  app.setViewEngine('hbs');
  await app.listen(process.env.SERVER_PORT);

  process.on('uncaughtException', function (err) {
    console.log(err);
    //Send some notification about the error
  });
}
bootstrap();
