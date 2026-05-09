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
  url_id: number;
  ip_address: string;
  region: string;
  browser: string;
  browser_version: string;
  os: string;
  clicked_at: string;
}

export interface IStatsResponse {
  url: IUrlStats;
  clicks: IClickData[];
}