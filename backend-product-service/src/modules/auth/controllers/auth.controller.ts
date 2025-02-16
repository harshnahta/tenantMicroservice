import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';

@ApiTags('Auth Manager')
@Controller({
  path: '/api/auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
