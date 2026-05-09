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
  const userInfo: IUserInfo = {
    ip: String(req.ip || req.socket.remoteAddress || 'Unknown'),
    userAgent: String(req.headers['user-agent'] || 'Unknown'),
    referer: String(req.headers.referer || req.headers.referrer || 'Direct')
  };
  
  req.userInfo = userInfo;
  next();
};
