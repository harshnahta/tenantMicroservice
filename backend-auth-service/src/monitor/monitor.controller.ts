import { Public } from '@common/decorators/roles.decorator';
import { Controller, Get, Render } from '@nestjs/common';

@Controller('monitor')
@Public()
export class MonitorController {
  @Get()
  @Render('monitor')
  root() {
    return { message: 'Hello world!' };
  }
}
