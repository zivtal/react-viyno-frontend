import { BaseRecords } from "../../../shared/models/base-records.model";

export interface Post {
  _id: number;
  createdAt: string;
  userId: number;
  replyId?: number;
  description: string;
  attach?: string;

  likes: number;
  ilike: number | null;
  replies: number;
  reply?: BaseRecords<Post>;

  seo?: string | null;
  winery?: string | null;
  wine?: string | null;
  vintage?: number | null;
  rate?: number | null;
  ratings?: number;

  userName?: string;
  photoData?: string;
  photoType?: string;
}
