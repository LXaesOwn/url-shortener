import { urlRepository } from '../repositories/urlRepository';
import { clickRepository } from '../repositories/clickRepository';
import { getRegion } from './geoService';
import { parseUserAgent } from '../utils/userAgentParser';
import { IUserInfo } from '../types';
import { UNKNOWN } from '../config/constants';
import logger from '../utils/logger';

export class StatsService {
  static async trackClick(urlId: number, userInfo: IUserInfo): Promise<void> {
    const region = await getRegion(userInfo.ip);
    const { browser, browserVersion, os, deviceType } = parseUserAgent(userInfo.userAgent);

    await clickRepository.create({
      url: { connect: { id: urlId } },
      ipAddress: userInfo.ip,
      region,
      browser,
      browserVersion,
      os,
      deviceType,
    });

    logger.info({ urlId, region }, 'Click tracked');
  }

  static async getStatsPage(shortCode: string) {
    const url = await urlRepository.findByShortCodeWithStats(shortCode);
    if (!url) return null;

    const clicks = url.clickStatistics;
    const totalClicks = url.clicks;

    const browserStats: Record<string, number> = {};
    const osStats: Record<string, number> = {};
    const deviceStats: Record<string, number> = {};
    const countryStats: Record<string, number> = {};
    const clicksByDate: Record<string, number> = {};

    clicks.forEach((click) => {
      const browser = click.browser || UNKNOWN;
      browserStats[browser] = (browserStats[browser] || 0) + 1;

      const os = click.os || UNKNOWN;
      osStats[os] = (osStats[os] || 0) + 1;

      const device = click.deviceType || UNKNOWN;
      deviceStats[device] = (deviceStats[device] || 0) + 1;

      const region = click.region || UNKNOWN;
      const country = region.split(',')[0];
      countryStats[country] = (countryStats[country] || 0) + 1;

      const date = click.clickedAt.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    return {
      url: {
        originalUrl: url.originalUrl,
        shareUrl: url.shareUrl,
        statsUrl: url.statsUrl,
        totalClicks,
        createdAt: url.createdAt,
      },
      stats: {
        totalClicks,
        browserStats,
        osStats,
        deviceStats,
        countryStats,
        clicksByDate,
        allClicks: clicks,
      },
    };
  }

  static async getAllUrls() {
    return urlRepository.findAll();
  }
}
