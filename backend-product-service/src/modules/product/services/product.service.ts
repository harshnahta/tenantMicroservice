import {
  CreateProductDTO,
  DeleteProductDTO,
  UpdateProductDTO,
} from '../dto/product.dto';

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';

@Injectable()
export class ProductService {
  private selectFields: any;
  private extendFields: any;
  constructor(private readonly prisma: PrismaSelectService) {
    this.selectFields = {
      id: true,
      title: true,
      description: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    } as any;
  }

  async getAll(tenantId: string) {
    try {
      const result = await this.prisma.findTenantResults(tenantId, 'Products');

      return { result };
    } catch (error: any) {
      throw error;
    }
  }

  async create(tenantId: string, userId: string, payload: CreateProductDTO) {
    try {
      const product = await this.prisma.insertTenantProductData(
        tenantId,
        'Products',
        {
          ...payload,
        },
      );

      return product;
    } catch (error: any) {
      throw error;
    }
  }

  async findTaskById(tenantId: string, id: string) {
    const where = {
      id: id,
    };
    const selectFields = {
      select: this.selectFields,
    };

    const task = await this.prisma.findOne(
      tenantId,
      'Products',
      where,
      selectFields,
      this.extendFields,
    );
    if (!task) {
      throw new BadRequestException('No Product found');
    }
    return task;
  }

  async update(tenantId: string, id: string, payload: UpdateProductDTO) {
    try {
      const findResponse = await this.prisma.findOne('', 'Products', {
        id: id,
      });
      if (!findResponse) throw new BadRequestException('No Product found');

      const updatedPayload = {
        ...payload,
      };

      const whereCondition = {
        id: findResponse.id,
      };
      const selectedFields = { ...this.selectFields };
      delete selectedFields.fullname;
      const task = await this.prisma.updateOne(
        tenantId,
        'Products',
        whereCondition,
        updatedPayload,
        selectedFields,
      );
      return task;
    } catch (error: any) {
      throw error;
    }
  }

  async changeStatusTask(tenantId: string, id: string, status: string) {
    try {
      const findResponse = await this.prisma.findOne('', 'Products', {
        id: id,
      });
      if (!findResponse) throw new BadRequestException('No Product found');

      const updatedPayload = {
        status,
      };

      const whereCondition = {
        id: findResponse.id,
      };
      const selectedFields = { ...this.selectFields };
      delete selectedFields.fullname;
      const task = await this.prisma.updateOne(
        tenantId,
        'Products',
        whereCondition,
        updatedPayload,
        selectedFields,
      );
      return task;
    } catch (error: any) {
      throw error;
    }
  }

  async delete(tenantId: string, body: DeleteProductDTO) {
    try {
      if (!body?.id.length) {
        throw new BadRequestException('Product ID not found');
      }
      const count = await this.prisma.count('', 'Products', {
        where: {
          id: { in: body?.id },
        },
      });
      if (count !== body?.id.length) {
        throw new BadRequestException('No Product found');
      }
      await this.prisma.deleteMany(tenantId, 'Products', {
        id: { in: body?.id },
      });
      return {
        message: 'Products deleted successfully!',
      };
    } catch (error: any) {
      throw error;
    }
  }
}
