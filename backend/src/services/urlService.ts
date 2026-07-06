import prisma from './prismaService';
import { env } from '../config/env';
import { CONSTANTS } from '../config/constants';

export class UrlService {
  static generateShortCode(length: number = CONSTANTS.SHORT_CODE_LENGTH): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async createShortUrl(originalUrl: string): Promise<{ shareUrl: string; statsUrl: string }> {
    let shortCode = this.generateShortCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < CONSTANTS.MAX_GENERATION_ATTEMPTS) {
      const existing = await prisma.url.findUnique({ where: { shortCode } });
      if (!existing) {
        isUnique = true;
      } else {
        shortCode = this.generateShortCode();
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Unable to generate unique short code');
    }

    const shareUrl = `${env.BASE_URL}/api/s/${shortCode}`;
    const statsUrl = `${env.BASE_URL}/api/stats/${shortCode}`;

    await prisma.url.create({
      data: { originalUrl, shortCode, shareUrl, statsUrl },
    });

    return { shareUrl, statsUrl };
  }

  static async getUrlByShortCode(shortCode: string) {
    return prisma.url.findUnique({
      where: { shortCode },
      include: { clickStatistics: true },
    });
  }

  static async incrementClicks(shortCode: string) {
    return prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    });
  }
}