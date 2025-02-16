import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import moment from 'moment-timezone';

import { formatDate, dateDiff } from '@common/global-helpers/all.helpers';

import { PrismaSelectService } from '@providers/prisma/prisma-select.service';
import { LoginUserDTO } from '../dto/auth.dto';
import { IPayloadUserJwt, ISessionAuthToken } from '@common/global-interfaces';
import { PasswordService } from './password.service';
import { createTenantSchema } from './schemaCreate';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaSelectService,
    private passwordService: PasswordService,
  ) {}

  async register({ email, password, firstname, lastname, userId = null }) {
    if (userId) {
      const user = await this.prisma.findOne('Users', {
        id: userId,
      });
      if (!user) {
        throw new BadRequestException('User Not exists');
      }
    } else {
      const user = await this.prisma.findOne('Users', {
        email: email,
      });
      if (user) {
        throw new BadRequestException('User Already exists');
      }
    }
    const updatedUser = {
      email,
      firstname,
      lastname,
      status: true,
    };

    if (userId && password) {
      updatedUser['password'] = await this.passwordService.hashPassword(
        password,
      );
    } else if (!userId) {
      updatedUser['password'] = await this.passwordService.hashPassword(
        password,
      );
    }

    const userCreated = userId
      ? await this.prisma.updateOne('Users', { id: userId }, { ...updatedUser })
      : await this.prisma.save('Users', updatedUser);
    await createTenantSchema(userCreated.tenantId);
    return { id: userCreated.id };
  }

  async login(headers, { email, password, rememberme }: LoginUserDTO) {
    try {
      const header = headers['x-forwarded-for'] || email;
      const user = await this.prisma.findOne('Users', {
        email: email,
      });
      if (!user) {
        throw new BadRequestException('No user found');
      }

      if (!user.status) {
        throw new BadRequestException('Your account is not Active.');
      }

      let noOfAttempts = await this.prisma.count('Lockout', {
        where: {
          userIP: header,
        },
      });

      if (noOfAttempts >= 5) {
        const lastAttempt = await this.prisma.findMany('Lockout', {
          where: {
            userIP: header,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        });
        if (
          lastAttempt.length &&
          lastAttempt[0]?.lockoutTimeout &&
          dateDiff(lastAttempt[0]?.lockoutTimeout, new Date(), 'minutes') > 0
        ) {
          throw new BadRequestException(
            `You have been lockout. Please try after ${dateDiff(
              lastAttempt[0]?.lockoutTimeout,
              new Date(),
              'minutes',
            )} minutes`,
          );
        } else {
          // Now the time has been passed out so clear the attemps and let it try again
          await this.prisma.deleteMany('Lockout', {
            userIP: header,
          });
          noOfAttempts = 0;
        }
      }
      const isMatchedPassword = await this.passwordService.validatePassword(
        password,
        user.password,
      );
      if (user && isMatchedPassword) {
        // Generate auth token and update user info
        const payload: IPayloadUserJwt = {
          tenantId: user.tenantId,
          userId: user.id,
          rememberme: rememberme,
          role: user.role,
        };
        const authToken: ISessionAuthToken =
          await this.passwordService.generateAuthTokenFromLogin(payload);

        await Promise.all([
          this.prisma.updateOne(
            'Users',
            { id: user.id },
            { lastLogin: formatDate(null, null, true) },
          ),
          this.prisma.deleteMany('Lockout', { userIP: header }),
        ]);
        delete user.password;
        delete user.auth;
        return {
          message: `User login sucessfully`,
          data: {
            ...user,
            accessToken: authToken?.accessToken,
            refreshToken: authToken?.refreshToken,
            lastLogin: formatDate(null, null, true),
          },
          status: true,
          isOtp: false,
        };
      } else {
        await this.handleFailedLoginAttempt(header, noOfAttempts);
        throw new UnauthorizedException('Username or Password incorrect');
      }
    } catch (error) {
      throw error;
    }
  }
  async handleFailedLoginAttempt(header, noOfAttempts) {
    await this.prisma.save('Lockout', {
      userIP: header,
      lockoutTimeout: moment(new Date()).add(20, 'minute').toISOString(),
    });

    if (noOfAttempts + 1 >= 2) {
      const remainingAttempt = 5 - (noOfAttempts + 1);
      if (remainingAttempt === 0) {
        throw new BadRequestException(
          'You have been locked out. Please try after 20 minutes',
        );
      }
      throw new BadRequestException(
        `Username or Password Incorrect. ${remainingAttempt} ${
          remainingAttempt > 1 ? 'attempts' : 'attempt'
        } remaining`,
      );
    }
  }
}
