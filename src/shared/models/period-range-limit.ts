export interface PeriodRangeLimit<T = string> {
  minDateFrom?: T | null;
  maxDateFrom?: T | null;
  minDateTo?: T | null;
  maxDateTo?: T | null;
}
