import { Pagination } from "./pagination";
import { BaseSort } from "./base-sort";
import { BaseFilter } from "./base-filter";

export interface BaseQueries {
  page?: Pagination;
  sort?: BaseSort;
  filter?: BaseFilter;
}
