import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private clients: Map<string, PrismaClient> = new Map();

  getPrismaClient(tenantId: string): PrismaClient {
    if (this.clients.has(tenantId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.clients.get(tenantId)!;
    }

    const databaseUrl = process.env.DATABASE_URL?.replace('public', tenantId);
    console.log({ databaseUrl });
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
    this.clients.set(tenantId, prisma);
    return prisma;
  }

  async onModuleInit() {
    // Optional: Initialize connections if needed
  }

  async onModuleDestroy() {
    for (const client of this.clients.values()) {
      await client.$disconnect();
    }
    this.clients.clear();
  }
}
