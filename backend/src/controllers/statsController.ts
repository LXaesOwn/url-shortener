import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StatsService } from '../services/statsService';
import prisma from '../services/prismaService';

export class StatsController {
  static async getStats(req: Request, res: Response) {
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

      const detailedStats = await StatsService.getDetailedStats(shortCode);

      res.status(StatusCodes.OK).json({
        url: {
          originalUrl: url.originalUrl,
          shareUrl: url.shareUrl,
          statsUrl: url.statsUrl,
          totalClicks: url.clicks,
          createdAt: url.createdAt,
        },
        stats: detailedStats,
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get statistics',
      });
    }
  }

  static async getAllStats(req: Request, res: Response) {
    try {
      const urls = await StatsService.getAllUrls();
      res.status(StatusCodes.OK).json(urls);
    } catch (error) {
      console.error('Error getting all stats:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get statistics',
      });
    }
  }
}