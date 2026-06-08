import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UrlService } from '../services/urlService';
import { StatsService } from '../services/statsService';
import prisma from '../services/prismaService';

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

      res.status(StatusCodes.CREATED).json({
        shareUrl,
        statsUrl,
      });
    } catch (error) {
      console.error('Error shortening URL:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to shorten URL',
      });
    }
  }

  static async redirectToOriginal(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;

      const url = await prisma.url.findUnique({
        where: { shortCode },
      });

      if (!url) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'URL not found',
        });
      }

      await prisma.url.update({
        where: { shortCode },
        data: { clicks: { increment: 1 } },
      });

      const userInfo = {
        ip: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        referer: String(req.headers.referer || req.headers.referrer || 'direct'),
      };

      await StatsService.trackClick(url.id, userInfo);

      res.redirect(StatusCodes.MOVED_TEMPORARILY, url.originalUrl);
    } catch (error) {
      console.error('Error redirecting:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to redirect',
      });
    }
  }
}