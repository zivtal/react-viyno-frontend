import { BaseRecords } from "../../../shared/models/base-records.model";
import { Attachment } from "../../../components/Attachments/Attachments";

export interface Post {
  _id?: number;
  description: string;
  attach?: Array<Attachment>;
}

export interface FullPost extends Post {
  createdAt: string;
  userId: number;
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
  ratings?: number;

  userName?: string;
  userPhoto?: string;
}

export interface Reply extends Post {
  replyId: number;
}

export interface Review extends Post {
  wineId: number;
  vintage?: number;
  rate: number;
  lat?: number;
  lng?: number;
}
