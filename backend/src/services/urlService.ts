import { nanoid } from 'nanoid';
import { urlRepository } from '../repositories/urlRepository';
import { env } from '../config/env';
import { CONSTANTS } from '../config/constants';

export class UrlService {
  static generateShortCode(length: number = CONSTANTS.SHORT_CODE_LENGTH): string {
    return nanoid(length);
  }

  static async createShortUrl(originalUrl: string): Promise<{ shareUrl: string; statsUrl: string }> {
    let shortCode = this.generateShortCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < CONSTANTS.MAX_GENERATION_ATTEMPTS) {
      const existing = await urlRepository.findByShortCode(shortCode);
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

    await urlRepository.create({
      originalUrl,
      shortCode,
      shareUrl,
      statsUrl,
    });

    return { shareUrl, statsUrl };
  }

  static async getOriginalUrl(shortCode: string) {
    return urlRepository.findOriginalUrl(shortCode);
  }

  static async incrementClicks(shortCode: string) {
    return urlRepository.incrementClicks(shortCode);
  }

  static async getUrlWithStats(shortCode: string) {
    return urlRepository.findByShortCodeWithStats(shortCode);
  }

  static async getAllUrls() {
    return urlRepository.findAll();
  }
}