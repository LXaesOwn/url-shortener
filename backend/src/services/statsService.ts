import prisma from './prismaService';
import { getRegion, LOCATION_TYPE } from './geoService';
import { parseUserAgent } from '../utils/userAgentParser';
import { IUserInfo } from '../types';

export class StatsService {

  static async trackClick(urlId: number, userInfo: IUserInfo): Promise<void> {
    const region = await getRegion(userInfo.ip);
    const { browser, browserVersion, os, deviceType } = parseUserAgent(userInfo.userAgent);

    await prisma.clickStatistics.create({
      data: {
        urlId,
        ipAddress: userInfo.ip,
        region,
        browser,
        browserVersion,
        os,
        deviceType,
      },
    });
  }

  static async getClicksByUrlId(urlId: number) {
    return prisma.clickStatistics.findMany({
      where: { urlId },
      orderBy: { clickedAt: 'desc' },
    });
  }

  static async getDetailedStats(shortCode: string) {

    const url = await prisma.url.findUnique({
      where: { shortCode },
      include: {
        clickStatistics: true,
      },
    });

    if (!url) return null;

    const clicks = url.clickStatistics;
    const totalClicks = url.clicks;

  
    const browserStats: Record<string, number> = {};
    const osStats: Record<string, number> = {};
    const deviceStats: Record<string, number> = {};
    const countryStats: Record<string, number> = {};
    const clicksByDate: Record<string, number> = {};

    clicks.forEach((click) => {
      const browser = click.browser || 'unknown';
      browserStats[browser] = (browserStats[browser] || 0) + 1;

      const os = click.os || 'unknown';
      osStats[os] = (osStats[os] || 0) + 1;

      const device = click.deviceType || 'unknown';
      deviceStats[device] = (deviceStats[device] || 0) + 1;

    
      const region = click.region || 'unknown';
      const country = region.split(',')[0];
      countryStats[country] = (countryStats[country] || 0) + 1;

      const date = click.clickedAt.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    return {
      totalClicks,
      browserStats,
      osStats,
      deviceStats,
      countryStats,
      clicksByDate,
      allClicks: clicks,
    };
  }


  static async getAllUrls() {
    return prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}