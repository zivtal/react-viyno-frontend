export interface Login {
  fullname?: string;
  username?: string;
  password?: string;
}

export interface User {
  _id: number;
  createdAt: string;
  username: string;
  fullname: string;
  imageData: string;
  imageType: string;
  lat: number | null;
  lng: number | null;
  country: number | null;
  lastLogin: string;
}
