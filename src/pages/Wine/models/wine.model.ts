import { Pagination } from "../../../shared/models/pagination";
import { BaseQueries } from "../../../shared/models/base-queries";
import { BaseSort } from "../../../shared/models/base-sort";
import {
  WINE_KEYWORDS,
  WINE_SECTIONS,
  WINES,
  WINES_CACHE,
  WINES_FILTER,
  WINES_SORT,
} from "../store/types";
import { BaseFilter } from "../../../shared/models/base-filter";
import { BaseRecords } from "../../../shared/models/base-records";
import { FullPost } from "../../UserFeed/models/post.model";
import { SelectItem } from "../../../shared/models/select-item";

export interface WineState {
  [WINES]: Array<Wine>;
  [WINES_FILTER]: BaseFilter;
  [WINES_SORT]: BaseSort;
  [WINE_KEYWORDS]: WineKeywords | null;
  [WINE_SECTIONS]: WineSections;
  [WINES_CACHE]: Array<Wine>;
  page: Pagination;
  total: number | null;
  loading: boolean;
}

export interface WineRegion extends SelectItem {
  country?: string;
}

export interface WineStyle extends SelectItem {
  country?: string;
  grapes?: string;
  type?: string;
}

export interface WineStructure {
  bold?: number;
  tannic?: number;
  sweet?: number;
  acidic?: number;
}

export interface WineBaseSection {
  seo?: string;
  name: string;
  country?: string;
  region?: string;
  flag?: string;
}

export interface WineSections {
  winery: Array<WineBaseSection>;
  name: Array<WineBaseSection>;
  country: Array<WineBaseSection>;
  region: Array<WineBaseSection>;
  style: Array<WineBaseSection>;
}

export interface WineKeywords {
  data: {
    wineType: Array<SelectItem>;
    grapes: Array<SelectItem>;
    regions: Array<WineRegion>;
    countries: Array<SelectItem>;
    wineStyles: Array<WineStyle>;
    foodPairings: Array<SelectItem>;
  };
  query: {
    [key: string]: string;
  };
}

export interface WineKeywordsReq {
  section: string;
  seo: string;
}

export interface WineTasteMentions {
  keyword: string;
  count: number;
}

export interface WineTaste {
  name: string;
  mentions: Array<WineTasteMentions>;
  color: string;
  total: number;
}

export interface Wine {
  _id?: number;
  seo: string;
  name: string;
  winery: string;
  country?: string;
  region?: string;
  imageData?: string;
  imageType?: string;
  style?: string;
  type?: string;
  acidic?: number;
  bold?: number;
  sweet?: number;
  tannic?: number;
  grapes?: Array<string>;
  pairings?: Array<string>;
  tastes?: Array<WineTaste>;
  rate?: number;
  rate1?: number;
  rate2?: number;
  rate3?: number;
  rate4?: number;
  rate5?: number;
  ratings?: number;
  background?: string;
  wineryLogo?: string;
  wineryOverview?: string;
  wineryProducts?: number;
  wineryRate?: number;
  wineryRatings?: number;
  helpfulReviews?: BaseRecords<FullPost>;
  myReviews?: BaseRecords<FullPost>;
  recentReviews?: BaseRecords<FullPost>;
}

export interface WineQuery extends BaseQueries {
  seo?: string;
  _id?: number;
  vintage?: number;
}
