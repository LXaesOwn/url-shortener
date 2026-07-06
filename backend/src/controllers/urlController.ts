import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { UrlService } from '../services/urlService';
import { StatsService } from '../services/statsService';
import { urlSchema } from '../utils/validation';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class UrlController {
  static async shortenUrl(req: Request, res: Response) {
    try {
      const { originalUrl } = urlSchema.parse(req.body);

      let urlToShorten = originalUrl;
      if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
        urlToShorten = 'https://' + urlToShorten;
      }

      const { shareUrl, statsUrl } = await UrlService.createShortUrl(urlToShorten);

      logger.info(`URL shortened successfully: ${shareUrl}`, { originalUrl, shareUrl });

      return res.status(StatusCodes.CREATED).json({ shareUrl, statsUrl });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      logger.error('Failed to shorten URL', { error });
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
        throw new AppError('URL not found', StatusCodes.NOT_FOUND);
      }

      await UrlService.incrementClicks(shortCode);

      if (req.userInfo) {
        await StatsService.trackClick(url.id, req.userInfo);
      }

      logger.info(`Redirect successful: ${shortCode} -> ${url.originalUrl}`);

      return res.redirect(StatusCodes.MOVED_TEMPORARILY, url.originalUrl);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      logger.error('Redirect failed', { error, shortCode: req.params.shortCode });
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to redirect',
      });
    }
  }
}