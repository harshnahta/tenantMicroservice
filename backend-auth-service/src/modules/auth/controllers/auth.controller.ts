import {
  Body,
  Controller,
  Post,
  Response,
  Session,
  Headers,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { CUSTOMERS } from '@prisma/client';

import { envConfig } from '@common/configs/env.config';

import { AuthService } from '../services/auth.service';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';

import { Public } from '@common/decorators/roles.decorator';
@ApiTags('Auth Manager')
@Controller({
  path: '/api/auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ description: 'Register user' })
  @ApiBody({ type: RegisterUserDTO })
  async register(
    @Headers() headers,
    @Session() session,
    @Body() payload: RegisterUserDTO,
    @Response() res,
  ) {
    const registerData = await this.authService.register(payload);

    return res.status(200).send(registerData);
  }

  @Public()
  @Post('login')
  @ApiOperation({ description: 'Login user' })
  @ApiBody({ type: LoginUserDTO })
  async login(
    @Headers() headers,
    @Session() session,
    @Body() payload: LoginUserDTO,
    @Response() res,
  ) {
    const loginData = await this.authService.login(headers, payload);
    if (loginData.isOtp) {
      return res.status(200).send(loginData);
    }
    session.userData = loginData.data;
    const envJwt = envConfig().jwtOptions;
    let accessTokenExpiresIn = envJwt.tokenExpiresOnRemeberMe;

    if (payload.rememberme) {
      accessTokenExpiresIn = envJwt.accessTokenExpiresIn;
    }
    res.cookie('accessToken', loginData.data.accessToken, {
      expires: new Date(new Date().getTime() + accessTokenExpiresIn * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: false,
    });

    return res.status(200).send(loginData);
  }
}
