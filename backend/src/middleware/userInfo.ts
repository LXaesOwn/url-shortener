import { Request, Response, NextFunction } from 'express';
import { IUserInfo } from '../types';

declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
    }
  }
}

export const getUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const referer = req.headers.referer || req.headers.referrer;
  const refererString = Array.isArray(referer) ? referer[0] : referer;

  req.userInfo = {
    ip: String(req.ip || req.socket.remoteAddress || 'unknown'),
    userAgent: String(req.headers['user-agent'] || 'unknown'),
    referer: refererString || 'direct',
  };

  next();
};