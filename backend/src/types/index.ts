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
  ipAddress: string | null;
  region: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  deviceType: string | null;
  clickedAt: Date;
}

export interface IUserInfo {
  ip: string;
  userAgent: string;
  referer: string;
}
