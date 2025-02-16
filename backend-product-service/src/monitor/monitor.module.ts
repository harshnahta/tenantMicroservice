import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MonitorController],
})
export class MonitorModule {}
