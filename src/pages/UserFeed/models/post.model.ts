import { BaseRecords } from '../../../shared/interfaces/base-records';
import { Attachment } from '../../../components/Attachments/Attachments';

export interface Post {
  createdAt?: string | number;
  _id?: number;
  description: string;
  attach?: Array<Attachment>;
  userId?: number;
  userName?: string;
  userPhoto?: string;
  ratings?: number;
}

export interface FullPost extends Post {
  replyId?: number;

  likes: number;
  ilike: number | null;
  replies: number;
  reply?: BaseRecords<FullPost>;

  seo?: string | null;
  winery?: string | null;
  wine?: string | null;
  vintage?: number | null;
  rate?: number | null;
}

export interface Reply extends Post {
  replyId: number;
}

export interface Review extends Post {
  wineId: number;
  vintage?: number;
  rate: number;
  latitude?: number;
  longitude?: number;
}
