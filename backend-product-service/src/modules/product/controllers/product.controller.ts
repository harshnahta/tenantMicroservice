import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import {
  CreateProductDTO,
  DeleteProductDTO,
  GetProductDTO,
  UpdateProductDTO,
} from '../dto/product.dto';
import { AuthUser } from '@common/decorators/authUser.decorator';
import { Users } from '@prisma/client';

@ApiTags('Product Manager')
@ApiBearerAuth('Authorization')
@Controller({
  path: '/api/product',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  @ApiOperation({ description: 'Product Get' })
  @ApiBody({ type: GetProductDTO })
  async getUser(@AuthUser() user: Users) {
    return await this.productService.getAll(user.tenantId);
  }

  @Post('add')
  @ApiOperation({ description: 'Product Add' })
  @ApiBody({ type: CreateProductDTO })
  async addUser(@Body() payload: CreateProductDTO, @AuthUser() user: Users) {
    const { tenantId, id } = user || {};
    return await this.productService.create(tenantId, id, payload);
  }

  @Get('get-details/:id')
  @ApiOperation({ description: 'Product Details' })
  async getDetails(@Param('id') id: string, @AuthUser() user: Users) {
    const tenantId = user?.tenantId || '';
    return await this.productService.findTaskById(tenantId, id);
  }

  @Put('update/:id')
  @ApiOperation({ description: 'Product Update' })
  @ApiBody({ type: UpdateProductDTO })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateProductDTO,
    @AuthUser() user: Users,
  ) {
    const tenantId = user?.tenantId || '';
    return await this.productService.update(tenantId, id, payload);
  }

  @Put('change-status/:id')
  @ApiOperation({ description: 'Product Update' })
  @ApiBody({})
  async changeStatus(
    @Param('id') id: string,
    @Body() payload: any,
    @AuthUser() user: Users,
  ) {
    const tenantId = user?.tenantId || '';
    return await this.productService.changeStatusTask(
      tenantId,
      id,
      payload?.status,
    );
  }

  @Delete('delete')
  @ApiOperation({ description: 'Tasks Delete' })
  @ApiBody({ type: DeleteProductDTO })
  async delete(@Body() payload: DeleteProductDTO, @AuthUser() user: Users) {
    const tenantId = user?.tenantId || '';
    return await this.productService.delete(tenantId, payload);
  }
}
