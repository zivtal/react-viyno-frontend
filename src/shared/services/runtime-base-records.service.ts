import { BaseRecordsModel } from "../models/base-records.model";

export default class RuntimeBaseRecordsService {
  public static append<T>(
    insert?: BaseRecordsModel<T>,
    state?: BaseRecordsModel<T>,
    uniqueKey: string = "id"
  ): BaseRecordsModel<T> {
    type ObjectKey = keyof T;

    if (!state || !insert?.page?.index) {
      return (insert || state) as BaseRecordsModel<T>;
    }

    return {
      data: uniqueKey
        ? [
            ...(state?.data?.filter(
              ({ [uniqueKey as ObjectKey]: val1 }: T) =>
                !insert.data?.find(
                  ({ [uniqueKey as ObjectKey]: val2 }: T) => val1 === val2
                )
            ) || []),
            ...(insert.data || []),
          ]
        : [...(state.data || []), ...(insert.data || [])],
      page: insert.page || state?.page,
      total: insert.total || state?.total,
    };
  }

  public static insert<T>(
    insert?: BaseRecordsModel<T>,
    state?: BaseRecordsModel<T>,
    uniqueKey: string = "id"
  ): BaseRecordsModel<T> {
    type ObjectKey = keyof T;

    if (!state || !insert?.page?.index) {
      return (insert || state) as BaseRecordsModel<T>;
    }

    return {
      data: uniqueKey
        ? [
            ...(insert?.data || []),
            ...(state?.data?.filter(
              ({ [uniqueKey as ObjectKey]: val1 }: T) =>
                !insert.data?.find(
                  ({ [uniqueKey as ObjectKey]: val2 }: T) => val1 === val2
                )
            ) || []),
          ]
        : [...(insert?.data || []), ...(state?.data || [])],
      page: insert?.page || state?.page,
      total: insert?.total || state?.total,
    };
  }

  public static overwrite<T>(
    insert: BaseRecordsModel<T>,
    state: BaseRecordsModel<T>,
    uniqueKey: string = "id"
  ): BaseRecordsModel<T> {
    type ObjectKey = keyof T;

    if (!state || !insert?.page?.index) {
      return (insert || state) as BaseRecordsModel<T>;
    }

    return {
      data: uniqueKey
        ? [
            ...(insert?.data || []),
            ...(state?.data?.filter(
              ({ [uniqueKey as ObjectKey]: val1 }: T) =>
                !insert?.data?.find(
                  ({ [uniqueKey as ObjectKey]: val2 }: T) => val1 === val2
                )
            ) || []),
          ].slice(0, state?.data.length || insert?.data.length)
        : [...(insert?.data || []), ...(state?.data || [])].slice(
            0,
            state?.data.length || insert?.data.length
          ),
      page: state?.page || insert?.page,
      total: state?.total || insert?.total,
    };
  }

  public static update<T>(
    state: BaseRecordsModel<T>,
    unique: {
      key: string;
      value: any;
      recursiveKey?: string;
    },
    insert: any = {},
    counters?: {
      [key: string]: string;
    }
  ): BaseRecordsModel<T> {
    return {
      ...state,
      data: state.data.map((content: any): T => {
        if (content[unique.key] === unique.value) {
          if (counters) {
            for (const [key, value] of Object.entries(counters)) {
              content[key] = insert[value]
                ? content[key] + 1
                : content[key] - 1;
            }
          }

          return { ...content, ...insert } as T;
        }

        return unique.recursiveKey && content[unique.recursiveKey]
          ? {
              ...content,
              [unique.recursiveKey]: this.update(
                content[unique.recursiveKey] as BaseRecordsModel<T>,
                unique,
                insert,
                counters
              ),
            }
          : content;
      }),
    };
  }

  public static bulkInsert<T>(
    insert: Array<T>,
    state: BaseRecordsModel<T>,
    append = false
  ): BaseRecordsModel<T> {
    const count = state?.data.length - insert.length + 1;

    return {
      ...state,
      data: append
        ? [...(state?.data || []), ...insert].slice(1, count)
        : [...insert, ...(state?.data || [])].slice(0, count),
    };
  }

  public static bulkUpdate<T>(
    update: Array<T>,
    state: BaseRecordsModel<T>,
    uniqueKey: string = "id"
  ): BaseRecordsModel<T> {
    return {
      ...state,
      data: state.data.map((item: T) => {
        type ObjectKey = keyof T;

        const newRecord = update.find(
          (updateItem: T) =>
            updateItem[uniqueKey as ObjectKey] === item[uniqueKey as ObjectKey]
        );

        return newRecord || item;
      }),
    };
  }
}
