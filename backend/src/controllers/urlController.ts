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

      logger.info(`URL shortened successfully: ${shareUrl}`);
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

      const url = await UrlService.getOriginalUrl(shortCode);

      if (!url) {
        throw new AppError('URL not found', StatusCodes.NOT_FOUND);
      }

      res.redirect(StatusCodes.MOVED_TEMPORARILY, url.originalUrl);

      setImmediate(async () => {
        try {
          await UrlService.incrementClicks(shortCode);
          if (req.userInfo) {
            await StatsService.trackClick(url.id, req.userInfo);
          }
          logger.info(`Redirect tracked: ${shortCode}`);
        } catch (err) {
          logger.error('Failed to track redirect stats', { error: err, shortCode });
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      next(error);
    }
  }
}