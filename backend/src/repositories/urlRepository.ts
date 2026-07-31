import prisma from '../services/prismaService';
import { Prisma } from '@prisma/client';

export const urlRepository = {
  findByShortCode: (shortCode: string) =>
    prisma.url.findUnique({ where: { shortCode } }),

  findByShortCodeWithStats: (shortCode: string) =>
    prisma.url.findUnique({
      where: { shortCode },
      include: { clickStatistics: true },
    }),

  findOriginalUrl: (shortCode: string) =>
    prisma.url.findUnique({
      where: { shortCode },
      select: { id: true, originalUrl: true },
    }),

  create: (data: Prisma.UrlCreateInput) =>
    prisma.url.create({ data }),

  incrementClicks: (shortCode: string) =>
    prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    }),

  findAll: () =>
    prisma.url.findMany({ orderBy: { createdAt: 'desc' } }),
};

export type UrlRepository = typeof urlRepository;