import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';
import { PrismaModule } from '@providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommonService, PrismaSelectService],
  exports: [CommonService],
})
export class CommonModule {}
