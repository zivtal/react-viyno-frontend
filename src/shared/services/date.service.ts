import { PeriodDates } from '../models/period-dates';
import { PeriodRangeLimit } from '../models/period-range-limit';

export default class DateService {
  private static toDate = (value: string | null) => {
    const [day, month, year] = value?.split('/') || [];

    return day && month && year ? new Date(+year, +month - 1, +day) : null;
  };

  private static toTimestamp = (value?: string | null): number | null => (value ? Date.parse(value) : null);

  public static overlapCheck = (periods: Array<PeriodDates>, currentPeriod: PeriodDates, currentIndex: number): Array<number> => {
    return currentPeriod.dateTo && currentPeriod.dateFrom
      ? periods
          .map(({ dateTo, dateFrom }, index) => ({ dateTo, dateFrom, index }))
          .filter(({ dateFrom, dateTo }, index) => index !== currentIndex && dateFrom && dateTo)
          .reduce((overlaps: Array<number>, { dateTo, dateFrom, index }): Array<number> => {
            const dateTo1 = this.toTimestamp(currentPeriod.dateTo);
            const dateFrom1 = this.toTimestamp(currentPeriod.dateFrom);
            const dateTo2 = this.toTimestamp(dateTo);
            const dateFrom2 = this.toTimestamp(dateFrom);

            const checkDate1 = dateFrom1! > dateTo2! && dateTo1! > dateFrom2!;
            const checkDate2 = dateFrom1! < dateTo2! && dateTo1! < dateFrom2!;

            return checkDate1 || checkDate2 ? overlaps : [...overlaps, index as number];
          }, [])
      : [];
  };

  public static range = ({ value, period }: { value: PeriodDates; period?: PeriodDates }): PeriodRangeLimit => {
    const range: PeriodRangeLimit = {};

    const periodFrom = this.toTimestamp(period?.dateFrom);
    const periodTo = this.toTimestamp(period?.dateTo);
    const valueFrom = this.toTimestamp(value.dateFrom);
    const valueTo = this.toTimestamp(value.dateTo);

    if (valueFrom && periodFrom) {
      range.minDateFrom = valueFrom < periodFrom ? value.dateFrom : period?.dateFrom;
      range.minDateTo = valueFrom > periodFrom ? value.dateFrom : period?.dateFrom;
    } else if (periodFrom) {
      range.minDateFrom = period?.dateFrom;
      range.minDateTo = period?.dateFrom;
    } else if (valueFrom) {
      range.minDateTo = value.dateFrom;
    }

    if (valueTo && periodTo) {
      range.maxDateFrom = valueTo < periodTo ? value.dateTo : period?.dateTo;
      range.maxDateTo = valueTo > periodTo ? value.dateTo : period?.dateTo;
    } else if (periodTo) {
      range.maxDateFrom = period?.dateTo;
      range.maxDateTo = period?.dateTo;
    } else if (valueTo) {
      range.maxDateFrom = value.dateTo;
    }

    return Object.entries(range).reduce((result: PeriodRangeLimit, [key, val]) => (val ? { ...result, [key]: val } : result), {});
  };
}
