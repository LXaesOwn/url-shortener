import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { UrlService } from '../services/urlService';
import { StatsService } from '../services/statsService';
import { urlSchema } from '../utils/validation';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class UrlController {
  static async shortenUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { originalUrl } = urlSchema.parse(req.body);
      const { shareUrl, statsUrl } = await UrlService.createShortUrl(originalUrl);

      logger.info({ shareUrl }, 'URL shortened successfully');
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
      next(error);
    }
  }

  static async redirectToOriginal(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;
      logger.info({ shortCode }, 'Redirect requested');

      const url = await UrlService.getOriginalUrl(shortCode);

      if (!url) {
        logger.warn({ shortCode }, 'URL not found');
        throw new AppError('URL not found', StatusCodes.NOT_FOUND);
      }

      try {
        await UrlService.incrementClicks(shortCode);
        if (req.userInfo) {
          await StatsService.trackClick(url.id, req.userInfo);
        }
        logger.info({ shortCode }, 'Stats tracked successfully');
      } catch (err) {
        logger.error({ err, shortCode }, 'Failed to track stats');
      }

      return res.redirect(StatusCodes.MOVED_TEMPORARILY, url.originalUrl);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      next(error);
    }
  }
}