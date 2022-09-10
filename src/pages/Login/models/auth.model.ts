export interface AuthModel {
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
  latitude: number | null;
  longitude: number | null;
  country: number | null;
  lastLogin: string;
}
