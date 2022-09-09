import { Pagination } from "./pagination";

export interface BaseRecordsModel<T> {
  data: Array<T>;
  page: Pagination;
  total: number;
}
