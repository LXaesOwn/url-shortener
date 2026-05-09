export interface IUrl {
  id: number;
  original_url: string;
  short_code: string;
  share_url: string;
  stats_url: string;
  clicks: number;
  created_at: Date;
}

export interface IClickData {
  id: number;
  url_id: number;
  ip_address: string;
  region: string;
  browser: string;
  browser_version: string;
  os: string;
  clicked_at: Date;
}

export interface IGeoData {
  country?: string;
  regionName?: string;
  city?: string;
}

export interface IUserInfo {
  ip: string;
  userAgent: string;
  referer: string;
}