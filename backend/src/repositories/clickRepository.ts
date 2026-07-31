import prisma from '../services/prismaService';
import { Prisma } from '@prisma/client';

export const clickRepository = {
  create: (data: Prisma.ClickStatisticsCreateInput) =>
    prisma.clickStatistics.create({ data }),

  findByUrlId: (urlId: number) =>
    prisma.clickStatistics.findMany({
      where: { urlId },
      orderBy: { clickedAt: 'desc' },
    }),

  findByUrlIdWithLimit: (urlId: number, limit: number) =>
    prisma.clickStatistics.findMany({
      where: { urlId },
      orderBy: { clickedAt: 'desc' },
      take: limit,
    }),
};

export type ClickRepository = typeof clickRepository;