export interface Winery {
  _id: number;
  name: string;
  region?: string;
  country?: string;
  address?: string;
  overview?: string;
  logoData?: string;
  logoType?: string;
  image?: string;
  lat?: number;
  lng?: number;
  rate?: number;
  ratings?: number;
  wines?: number;
}

export interface WineryQuery {
  lat?: number;
  lng?: number;
}
