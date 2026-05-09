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
      
      if (urlToShorten.length > CONSTANTS.MAX_ORIGINAL_URL_LENGTH) {
        return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
          error: 'URL is too long'
        });
      }
      
      const { shareUrl, statsUrl } = await UrlService.createShortUrl(urlToShorten);
      
      res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
        success: true,
        shareUrl,
        statsUrl
      });
    } catch (error) {
      console.error('Error shortening URL:', error);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to shorten URL'
      });
    }
  }
  
  static async redirectToOriginal(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const originalUrl = await UrlService.getOriginalUrl(shortCode);
      
      if (!originalUrl) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
          error: 'URL not found'
        });
      }
      
      const urlResult = await query('SELECT id FROM urls WHERE short_code = $1', [shortCode]);
      if (urlResult.rows.length > 0 && req.userInfo) {
        await StatsService.trackClick(urlResult.rows[0].id, req.userInfo);
      }
      
      res.redirect(CONSTANTS.HTTP_STATUS.OK, originalUrl);
    } catch (error) {
      console.error('Error redirecting:', error);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to redirect'
      });
    }
  }
}