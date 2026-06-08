export interface IUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  shareUrl: string;
  statsUrl: string;
  clicks: number;
  createdAt: Date;
}

export interface IClickData {
  id: number;
  urlId: number;
  ipAddress: string;
  region: string;
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: string;
  clickedAt: Date;
}

export interface IUserInfo {
  ip: string;
  userAgent: string;
  referer: string;
}