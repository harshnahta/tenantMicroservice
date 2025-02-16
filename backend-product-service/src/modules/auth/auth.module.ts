import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from '@common/constants/global.constants';
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';

import { JwtStrategy } from './guards/auth.jwt.strategy.guards';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { PasswordService } from './services/password.service';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule,
  ],
  providers: [PrismaSelectService, AuthService, PasswordService, JwtStrategy],
  controllers: [AuthController],
  exports: [PasswordService],
})
export class AuthModule {}
