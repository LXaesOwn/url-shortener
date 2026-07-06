import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UrlService } from '../services/urlService';
import { StatsService } from '../services/statsService';

export class UrlController {
  static async shortenUrl(req: Request, res: Response) {
    try {
      const { originalUrl } = req.body;

      if (!originalUrl) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Original URL is required',
        });
      }

      let urlToShorten = originalUrl;
      if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
        urlToShorten = 'https://' + urlToShorten;
      }

      const { shareUrl, statsUrl } = await UrlService.createShortUrl(urlToShorten);

      return res.status(StatusCodes.CREATED).json({ shareUrl, statsUrl });
    } catch (error) {
      console.error('Error shortening URL:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to shorten URL',
      });
    }
  }

  static async redirectToOriginal(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;

      const url = await UrlService.getUrlByShortCode(shortCode);

      if (!url) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'URL not found' });
      }

      await UrlService.incrementClicks(shortCode);

      if (req.userInfo) {
        await StatsService.trackClick(url.id, req.userInfo);
      }

      return res.redirect(StatusCodes.MOVED_TEMPORARILY, url.originalUrl);
    } catch (error) {
      console.error('Error redirecting:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to redirect',
      });
    }
  }
}