import { Wine } from "../../Wine/models/wine.model";

export interface Winery {
  _id: number;
  seo: string;
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
  mostPopular?: Array<Wine>;
  topRated?: Array<Wine>;
}

export interface WineryQuery {
  lat?: number;
  lng?: number;
}
