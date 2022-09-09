import { BaseRecordsModel } from "../../../shared/models/base-records.model";
import { Attachment } from "../../../components/Attachments/Attachments";

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
  reply?: BaseRecordsModel<FullPost>;

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
  lat?: number;
  lng?: number;
}
