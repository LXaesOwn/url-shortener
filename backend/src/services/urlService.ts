import { query } from '../models/db';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export class UrlService {
  static generateShortCode(length: number = 6): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static async createShortUrl(originalUrl: string): Promise<{ shareUrl: string; statsUrl: string }> {
    let shortCode = this.generateShortCode();
    let isUnique = false;
    
    while (!isUnique) {
      const existing = await query('SELECT id FROM urls WHERE short_code = $1', [shortCode]);
      if (existing.rows.length === 0) {
        isUnique = true;
      } else {
        shortCode = this.generateShortCode();
      }
    }
    
    const shareUrl = `${BASE_URL}/api/s/${shortCode}`;
    const statsUrl = `${BASE_URL}/api/stats/${shortCode}`;
    
    await query(
      'INSERT INTO urls (original_url, short_code, share_url, stats_url) VALUES ($1, $2, $3, $4)',
      [originalUrl, shortCode, shareUrl, statsUrl]
    );
    
    console.log(`✅ Created: ${shareUrl} -> ${originalUrl}`);
    
    return { shareUrl, statsUrl };
  }
  
  static async getOriginalUrl(shortCode: string): Promise<string | null> {
    const result = await query('SELECT original_url FROM urls WHERE short_code = $1', [shortCode]);
    
    if (result.rows.length > 0) {
      await query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [shortCode]);
      return result.rows[0].original_url;
    }
    
    return null;
  }
  
  static async getStats(shortCode: string): Promise<any | null> {
    const result = await query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    return result.rows[0] || null;
  }
}