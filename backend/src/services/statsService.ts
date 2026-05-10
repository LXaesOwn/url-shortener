import { IUserInfo } from '../types';
import { GeoService } from './geoService';
import { query } from '../models/db';
import { CONSTANTS } from '../config/constants';

export class StatsService {
  static async trackClick(urlId: number, userInfo: IUserInfo): Promise<void> {
    const region = await GeoService.getRegion(userInfo.ip);
    const { browser, browserVersion, os } = this.parseUserAgent(userInfo.userAgent);
    
   
    await query(
      `INSERT INTO click_statistics 
       (url_id, ip_address, region, browser, browser_version, os) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [urlId, userInfo.ip, region, browser, browserVersion, os]
    );
  }
  
  static async getClicksByUrlId(urlId: number): Promise<any[]> {
    const result = await query(
      'SELECT * FROM click_statistics WHERE url_id = $1 ORDER BY clicked_at DESC',
      [urlId]
    );
    return result.rows;
  }
  
  static async getDetailedStats(shortCode: string): Promise<any> {
    const urlResult = await query('SELECT id, clicks FROM urls WHERE short_code = $1', [shortCode]);
    
    if (urlResult.rows.length === 0) return null;
    
    const urlId = urlResult.rows[0].id;
    const totalClicks = urlResult.rows[0].clicks;
    
    const clicks = await query(
      'SELECT * FROM click_statistics WHERE url_id = $1 ORDER BY clicked_at DESC',
      [urlId]
    );
    
    const browserStats: Record<string, number> = {};
    const osStats: Record<string, number> = {};
    const countryStats: Record<string, number> = {};
    const clicksByDate: Record<string, number> = {};
    
    clicks.rows.forEach((click: any) => {
      const browser = click.browser || 'Unknown';
      browserStats[browser] = (browserStats[browser] || 0) + 1;
      
      const os = click.os || 'Unknown';
      osStats[os] = (osStats[os] || 0) + 1;
      
      const region = click.region || 'Unknown';
      const country = region.split(',')[0];
      countryStats[country] = (countryStats[country] || 0) + 1;
      
      const date = new Date(click.clicked_at).toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });
    
    return {
      totalClicks,
      browserStats,
      osStats,
      countryStats,
      clicksByDate,
      recentClicks: clicks.rows.slice(0, 20),
      allClicks: clicks.rows
    };
  }
  
  private static parseUserAgent(userAgentString: string): {
    browser: string;
    browserVersion: string;
    os: string;
  } {
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    let os = 'Unknown';
    
    for (const [browserName, pattern] of Object.entries(CONSTANTS.BROWSER_PATTERNS)) {
      const match = userAgentString.match(pattern);
      if (match) {
        browser = browserName;
        browserVersion = match[1] || 'Unknown';
        break;
      }
    }
    
    for (const [osName, pattern] of Object.entries(CONSTANTS.OS_PATTERNS)) {
      if (pattern.test(userAgentString)) {
        os = osName;
        break;
      }
    }
    
    return { browser, browserVersion, os };
  }
}