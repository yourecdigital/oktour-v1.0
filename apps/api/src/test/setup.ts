import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./test.db',
    },
  },
});

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.tour.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.media.deleteMany();
  await prisma.category.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
