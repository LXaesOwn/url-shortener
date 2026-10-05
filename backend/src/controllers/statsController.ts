import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StatsService } from '../services/statsService';
import { AppError } from '../utils/AppError';

export class StatsController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;
      const payload = await StatsService.getStatsPage(shortCode);

      if (!payload) {
        throw new AppError('URL not found', StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.OK).json(payload);
    } catch (error) {
      next(error);
    }
  }

  static async getAllStats(req: Request, res: Response, next: NextFunction) {
    try {
      const urls = await StatsService.getAllUrls();
      return res.status(StatusCodes.OK).json(urls);
    } catch (error) {
      next(error);
    }
  }
}
