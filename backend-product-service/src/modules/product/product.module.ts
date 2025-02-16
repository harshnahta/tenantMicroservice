import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';
import { PrismaModule } from '@providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PrismaSelectService, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
