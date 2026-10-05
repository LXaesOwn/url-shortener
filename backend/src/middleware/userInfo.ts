import { Request, Response, NextFunction } from 'express';
import { IUserInfo } from '../types';
import { DIRECT, UNKNOWN } from '../config/constants';

declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
    }
  }
}

export const getUserInfo = (req: Request, res: Response, next: NextFunction): void => {
  const referer = req.headers.referer || req.headers.referrer;
  const refererString = Array.isArray(referer) ? referer[0] : referer;

  req.userInfo = {
    ip: String(req.ip || req.socket.remoteAddress || UNKNOWN),
    userAgent: String(req.headers['user-agent'] || UNKNOWN),
    referer: refererString || DIRECT,
  };

  next();
};
