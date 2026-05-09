import { Request, Response } from 'express';
import { UrlService } from '../services/urlService';
import { StatsService } from '../services/statsService';
import { CONSTANTS } from '../config/constants';

export class StatsController {
  static async getStats(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      
      const url = await UrlService.getStats(shortCode);
      
      if (!url) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
          error: 'URL not found'
        });
      }
      
      const clicks = await StatsService.getClicksByUrlId(url.id);
      
      res.status(CONSTANTS.HTTP_STATUS.OK).json({
        url: {
          originalUrl: url.original_url,
          shareUrl: url.share_url,
          statsUrl: url.stats_url,
          totalClicks: url.clicks,
          createdAt: url.created_at
        },
        clicks
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get statistics'
      });
    }
  }
}
