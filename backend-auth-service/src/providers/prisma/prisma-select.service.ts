import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
// import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaSelectService {
  constructor(private readonly prismaService: PrismaService) {}

  rawQuery = this.prismaService;

  getNearbyLocations = async (
    userLatitude: number,
    userLongitude: number,
    radiusInKm: number,
  ) => {
    const radiusInMeters = radiusInKm * 1000;

    const nearbyLocations = await this.prismaService.$queryRaw(
      Prisma.sql`
      SELECT *, distance FROM (
        SELECT *, (
          6371000 * acos(
            cos(radians(${userLatitude})) *
            cos(radians(CAST(latitude AS FLOAT))) *
            cos(radians(CAST(longitude AS FLOAT)) - radians(${userLongitude})) +
            sin(radians(${userLatitude})) *
            sin(radians(CAST(latitude AS FLOAT)))
          )
        ) AS distance
        FROM "City"
      ) AS subquery
      WHERE distance < ${radiusInMeters}
      ORDER BY distance;
      `,
    );

    return nearbyLocations;
  };

  extend = (model: string, extendField?: any) => {
    return this.prismaService.$extends({
      result: extendField ?? {},
    })[model];
  };
  db = (model: string) => {
    return this.prismaService[model];
  };

  findMany = (
    model: string,
    payload?: any,
    options?: any,
    extendField?: any,
  ) => {
    let body = {};
    if (payload) body = { ...body, ...payload };
    if (options) body = { ...body, ...options };
    return this.extend(model, extendField).findMany(body);
  };
  count = (model: string, payload?: any, options?: any) => {
    let body = {};
    if (payload) body = { ...body, ...payload };
    if (options) body = { ...body, ...options };
    return this.db(model).count(body);
  };
  findAndCount = (
    model: string,
    payload?: any,
    options?: any,
    extendField?: any,
  ) => {
    let body = {};
    if (payload) body = { ...body, ...payload };
    if (options) body = { ...body, ...options };
    return this.prismaService.$transaction([
      this.db(model).count({
        where: payload.where,
      }),
      this.extend(model, extendField).findMany(body),
    ]);
  };
  findOne = (model: string, payload: any, options?: any, extendField?: any) => {
    let body = { where: payload };
    if (options) {
      body = { ...body, ...options };
    }
    return this.extend(model, extendField).findUnique(body);
  };

  save = (model: string, payload: any) => {
    try {
      return this.db(model).create({
        data: payload,
      });
    } catch (error: any) {
      throw error.message;
    }
  };

  saveMany = (model: string, payload: [any]) => {
    try {
      return this.db(model).createMany({
        data: payload,
        skipDuplicates: true,
      });
    } catch (error: any) {
      throw error.message;
    }
  };

  upsert = (model: string, searchPayload: any, bodyPayload: any) => {
    return this.db(model).upsert({
      where: searchPayload,
      create: bodyPayload,
      update: bodyPayload,
    });
  };

  updateOne = (
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
    return this.db(model).update(body);
  };

  updateMany = (model: string, searchPayload: any, bodyPayload: any) => {
    return this.db(model).updateMany({
      where: searchPayload,
      data: bodyPayload,
    });
  };

  deleteOne = (model: string, searchPayload: any) => {
    return this.db(model).delete({
      where: searchPayload,
    });
  };

  deleteMany = (model: string, searchPayload: any) => {
    return this.db(model).deleteMany({
      where: searchPayload,
    });
  };
  groupBy = (model: string, groupBy: Array<string>, where: any) => {
    return this.db(model).groupBy({
      by: groupBy,
      where,
    });
  };
}
