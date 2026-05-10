import { Request, Response } from 'express';
import { UrlService } from '../services/urlService';
import { StatsService } from '../services/statsService';
import { query } from '../models/db';
import { CONSTANTS } from '../config/constants';

export class UrlController {
  static async shortenUrl(req: Request, res: Response) {
    try {
      const { originalUrl } = req.body;
      
      console.log('Received URL:', originalUrl);
      
      if (!originalUrl) {
        return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
          error: 'Original URL is required'
        });
      }
      
      let urlToShorten = originalUrl;
      if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
        urlToShorten = 'https://' + urlToShorten;
      }
      
      const { shareUrl, statsUrl } = await UrlService.createShortUrl(urlToShorten);
      
      res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
        success: true,
        shareUrl,
        statsUrl
      });
    } catch (error: any) {
      console.error('Error shortening URL:', error.message);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to shorten URL: ' + error.message
      });
    }
  }
  
  static async redirectToOriginal(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      console.log('Redirecting shortCode:', shortCode);
      
      const result = await query('SELECT id, original_url FROM urls WHERE short_code = $1', [shortCode]);
      
      if (result.rows.length === 0) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
          error: 'URL not found'
        });
      }
      
      const urlId = result.rows[0].id;
      const originalUrl = result.rows[0].original_url;
      console.log('Redirecting to:', originalUrl);
      
     
      await query('UPDATE urls SET clicks = clicks + 1 WHERE id = $1', [urlId]);
      
      
      const userInfo = {
        ip: req.ip || req.socket.remoteAddress || 'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
        referer: String(req.headers.referer || req.headers.referrer || 'Direct')
      };
      
      
      await StatsService.trackClick(urlId, userInfo);
      
      // Редирект
      res.redirect(302, originalUrl);
    } catch (error: any) {
      console.error('Error redirecting:', error.message);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to redirect'
      });
    }
  }
}