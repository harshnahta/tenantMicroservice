import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaSelectService {
  constructor(private readonly prismaService: PrismaService) {}
  private pool = new Pool({ connectionString: process.env.DATABASE_URL });

  private getPrismaClient(tenantId: string): PrismaClient {
    return this.prismaService.getPrismaClient(tenantId);
  }

  rawQuery = (tenantId: string) => this.getPrismaClient(tenantId);

  extend = (tenantId: string, model: string, extendField?: any) => {
    return this.getPrismaClient(tenantId).$extends({
      result: extendField ?? {},
    })[model];
  };

  db = (tenantId: string, model: string) => {
    return this.getPrismaClient(tenantId)[model];
  };

  findMany = (
    tenantId: string,
    model: string,
    payload?: any,
    options?: any,
    extendField?: any,
  ) => {
    let body = {};
    if (payload) body = { ...body, ...payload };
    if (options) body = { ...body, ...options };
    return this.extend(tenantId, model, extendField).findMany(body);
  };

  count = (tenantId: string, model: string, payload?: any, options?: any) => {
    let body = {};
    if (payload) body = { ...body, ...payload };
    if (options) body = { ...body, ...options };
    return this.db(tenantId, model).count(body);
  };

  findAndCount = (
    tenantId: string,
    model: string,
    payload?: any,
    options?: any,
    extendField?: any,
  ) => {
    let body = {};
    if (payload) body = { ...body, ...payload };
    if (options) body = { ...body, ...options };
    return this.getPrismaClient(tenantId).$transaction([
      this.db(tenantId, model).count({
        where: payload.where,
      }),
      this.extend(tenantId, model, extendField).findMany(body),
    ]);
  };

  findOne = (
    tenantId: string,
    model: string,
    payload: any,
    options?: any,
    extendField?: any,
  ) => {
    let body = { where: payload };
    if (options) {
      body = { ...body, ...options };
    }
    return this.extend(tenantId, model, extendField).findUnique(body);
  };

  save = (tenantId: string, model: string, payload: any) => {
    try {
      return this.db(tenantId, model).create({
        data: payload,
      });
    } catch (error: any) {
      throw error.message;
    }
  };

  saveMany = (tenantId: string, model: string, payload: [any]) => {
    try {
      return this.db(tenantId, model).createMany({
        data: payload,
        skipDuplicates: true,
      });
    } catch (error: any) {
      throw error.message;
    }
  };

  upsert = (
    tenantId: string,
    model: string,
    searchPayload: any,
    bodyPayload: any,
  ) => {
    return this.db(tenantId, model).upsert({
      where: searchPayload,
      create: bodyPayload,
      update: bodyPayload,
    });
  };

  updateOne = (
    tenantId: string,
    model: string,
    searchPayload: any,
    bodyPayload: any,
    selectFields?: any,
  ) => {
    const body = {
      data: bodyPayload,
      where: searchPayload,
    };
    if (selectFields) {
      body['select'] = selectFields;
    }
    return this.db(tenantId, model).update(body);
  };

  updateMany = (
    tenantId: string,
    model: string,
    searchPayload: any,
    bodyPayload: any,
  ) => {
    return this.db(tenantId, model).updateMany({
      where: searchPayload,
      data: bodyPayload,
    });
  };

  deleteOne = (tenantId: string, model: string, searchPayload: any) => {
    return this.db(tenantId, model).delete({
      where: searchPayload,
    });
  };

  deleteMany = (tenantId: string, model: string, searchPayload: any) => {
    return this.db(tenantId, model).deleteMany({
      where: searchPayload,
    });
  };

  groupBy = (
    tenantId: string,
    model: string,
    groupBy: Array<string>,
    where: any,
  ) => {
    return this.db(tenantId, model).groupBy({
      by: groupBy,
      where,
    });
  };
  async findTenantResults(tenantId: string, model: string) {
    const client = await this.pool.connect();
    try {
      await client.query(`SET search_path TO "${tenantId}"`);
      const result = await client.query(`SELECT * FROM ${model}`);

      return result.rows;
    } finally {
      client.release();
    }
  }

  async insertTenantProductData(
    tenantId: string,
    model: string,
    data: { title: string; description: string; price: number },
  ) {
    const client = await this.pool.connect();
    try {
      // Set the search path to the tenant's schema
      await client.query(`SET search_path TO "${tenantId}"`);

      // Insert query
      const query = `
        INSERT INTO ${model} (title, description, price, createdAt, updatedAt)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *;
      `;

      // Execute the query with parameters
      const values = [data.title, data.description, data.price];
      const result = await client.query(query, values);

      console.log('Inserted Record:', result.rows[0]);
      return result.rows[0]; // Returning the inserted record
    } finally {
      client.release();
    }
  }
}
