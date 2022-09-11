import { Pagination } from "./pagination";

export interface BaseRecords<T> {
  data: Array<T>;
  page: Pagination;
  total: number;
}
