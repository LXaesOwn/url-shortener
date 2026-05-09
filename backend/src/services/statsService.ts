import { query } from '../models/db';
import { IUserInfo } from '../types';
import { GeoService } from './geoService';
import { CONSTANTS } from '../config/constants';

export class StatsService {
  static async trackClick(urlId: number, userInfo: IUserInfo): Promise<void> {
    const region = await GeoService.getRegion(userInfo.ip);
    const { browser, browserVersion, os } = this.parseUserAgent(userInfo.userAgent);
    
    await query(
      `INSERT INTO click_statistics (url_id, ip_address, region, browser, browser_version, os)
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
