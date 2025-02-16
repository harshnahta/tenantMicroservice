import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';

import { JWT_SECRET } from '@common/constants/global.constants';
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaSelectService) {
    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([
    //     (req: any) => {
    //       // console.log('klg-17', req.headers?.authorization);
    //       return req.headers?.authorization;
    //       // return ExtractJwt.fromAuthHeaderAsBearerToken(req);
    //     },
    //   ]),
    //   ignoreExpiration: process.env.NODE_ENV === 'development',
    //   secretOrKey: JWT_SECRET,
    // });
    // console.log('klg-23');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.NODE_ENV === 'dev',
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: { userId: string }): Promise<Users> {
    // TODO We need to expire token here
    const user = await this.prisma.findOne('public', 'Users', {
      id: payload.userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
