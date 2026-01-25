import { PrismaClient } from 'generated/prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const accelerateUrl = process.env.PRISMA_ACCELERATE_URL ?? process.env.DATABASE_URL;
if (!accelerateUrl) {
  throw new Error('Missing Prisma connection URL. Set PRISMA_ACCELERATE_URL or DATABASE_URL.');
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    accelerateUrl,
  });

if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

