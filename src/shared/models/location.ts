export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo extends Coordinates {
  city?: string;
  country?: string;
  address?: string;
}
