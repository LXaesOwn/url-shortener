export interface ICreateUrlResponse {
  shareUrl: string;
  statsUrl: string;
}

export interface IUrlStats {
  originalUrl: string;
  shareUrl: string;
  statsUrl: string;
  totalClicks: number;
  createdAt: string;
}

export interface IClickData {
  id: number;
  urlId: number;
  ipAddress: string;
  region: string;
  browser: string;
  browserVersion: string;
  os: string;
  clickedAt: string;
}

export interface IStatsResponse {
  url: IUrlStats;
  stats: {
    totalClicks: number;
    browserStats: Record<string, number>;
    osStats: Record<string, number>;
    countryStats: Record<string, number>;
    clicksByDate: Record<string, number>;
    allClicks: IClickData[];
  };
}