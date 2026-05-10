import { Request, Response } from 'express';
import { query } from '../models/db';
import { CONSTANTS } from '../config/constants';

export class StatsController {
  static async getStats(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      
      const urlResult = await query(
        'SELECT id, original_url, share_url, stats_url, clicks, created_at FROM urls WHERE short_code = $1',
        [shortCode]
      );
      
      if (urlResult.rows.length === 0) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
          error: 'URL not found'
        });
      }
      
      const url = urlResult.rows[0];
      const urlId = url.id;
      
      const clicksResult = await query(
        'SELECT id, ip_address, region, browser, browser_version, os, clicked_at FROM click_statistics WHERE url_id = $1 ORDER BY clicked_at DESC',
        [urlId]
      );
      
      const clicks = clicksResult.rows;
      
      const browserStats: Record<string, number> = {};
      const osStats: Record<string, number> = {};
      const countryStats: Record<string, number> = {};
      const clicksByDate: Record<string, number> = {};
      
      clicks.forEach((click: any) => {
        const browser = click.browser || 'Unknown';
        browserStats[browser] = (browserStats[browser] || 0) + 1;
        
        const os = click.os || 'Unknown';
        osStats[os] = (osStats[os] || 0) + 1;
        
        const region = click.region || 'Unknown';
        const country = region.split(',')[0];
        countryStats[country] = (countryStats[country] || 0) + 1;
        
        const date = new Date(click.clicked_at).toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });
      
      const response = {
        url: {
          originalUrl: url.original_url,
          shareUrl: url.share_url,
          statsUrl: url.stats_url,
          totalClicks: parseInt(url.clicks) || 0,
          createdAt: url.created_at
        },
        stats: {
          totalClicks: parseInt(url.clicks) || 0,
          browserStats,
          osStats,
          countryStats,
          clicksByDate,
          allClicks: clicks
        },
        clicks
      };
      
      res.status(CONSTANTS.HTTP_STATUS.OK).json(response);
      
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get statistics'
      });
    }
  }

  static async getAllStats(req: Request, res: Response) {
    try {
      const result = await query(
        'SELECT id, original_url, short_code, share_url, stats_url, clicks, created_at FROM urls ORDER BY created_at DESC'
      );
      
      res.status(CONSTANTS.HTTP_STATUS.OK).json(result.rows);
    } catch (error) {
      console.error('Error getting all stats:', error);
      res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get statistics'
      });
    }
  }
}