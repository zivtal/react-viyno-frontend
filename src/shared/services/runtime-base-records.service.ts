import { BaseRecords } from '../interfaces/base-records';
import { HashedObject } from '../models/hashed-objects';
import { Id } from '../interfaces/id';

type Unique = {
  key: string;
  value: any;
  recursiveKey?: string;
};

export default class RuntimeBaseRecordsService {
  public static append<T>(insert?: BaseRecords<T>, state?: BaseRecords<T>, uniqueKey: Id = 'id'): BaseRecords<T> {
    return !state || !insert?.page?.index
      ? ((insert || state) as BaseRecords<T>)
      : {
          data: uniqueKey
            ? [
                ...(state?.data?.filter(
                  ({ [uniqueKey as keyof T]: val1 }: T) => !insert.data?.find(({ [uniqueKey as keyof T]: val2 }: T) => val1 === val2)
                ) || []),
                ...(insert.data || []),
              ]
            : [...(state.data || []), ...(insert.data || [])],
          page: insert.page || state?.page,
          total: insert.total || state?.total,
        };
  }

  public static insert<T>(insert?: BaseRecords<T>, state?: BaseRecords<T>, uniqueKey: Id = 'id'): BaseRecords<T> {
    return !state || !insert?.page?.index
      ? ((insert || state) as BaseRecords<T>)
      : {
          data: uniqueKey
            ? [
                ...(insert?.data || []),
                ...(state?.data?.filter(
                  ({ [uniqueKey as keyof T]: val1 }: T) => !insert.data?.find(({ [uniqueKey as keyof T]: val2 }: T) => val1 === val2)
                ) || []),
              ]
            : [...(insert?.data || []), ...(state?.data || [])],
          page: insert?.page || state?.page,
          total: insert?.total || state?.total,
        };
  }

  public static overwrite<T>(insert: BaseRecords<T>, state: BaseRecords<T>, uniqueKey: Id = 'id'): BaseRecords<T> {
    return !state || !insert?.page?.index
      ? insert || state
      : {
          data: uniqueKey
            ? [
                ...(insert?.data || []),
                ...(state?.data?.filter(
                  ({ [uniqueKey as keyof T]: val1 }: T) => !insert?.data?.find(({ [uniqueKey as keyof T]: val2 }: T) => val1 === val2)
                ) || []),
              ].slice(0, state?.data.length || insert?.data.length)
            : [...(insert?.data || []), ...(state?.data || [])].slice(0, state?.data.length || insert?.data.length),
          page: state?.page || insert?.page,
          total: state?.total || insert?.total,
        };
  }

  public static update<T>(state: BaseRecords<T>, unique: Unique, insert: HashedObject, counters?: HashedObject<string | number>): BaseRecords<T> {
    return {
      ...state,
      data: state.data.map((content: HashedObject): HashedObject => {
        if (content[unique.key] === unique.value) {
          if (counters) {
            for (const [key, value] of Object.entries(counters)) {
              content[key] = insert[value] ? content[key] + 1 : content[key] - 1;
            }
          }

          return { ...content, ...insert } as T;
        }

        return unique.recursiveKey && content[unique.recursiveKey]
          ? {
              ...content,
              [unique.recursiveKey]: this.update(content[unique.recursiveKey] as BaseRecords<T>, unique, insert, counters),
            }
          : content;
      }) as Array<T>,
    };
  }

  public static bulkInsert<T>(insert: Array<T>, state: BaseRecords<T>, append = false): BaseRecords<T> {
    const count = state?.data.length - insert.length + 1;

    return {
      ...state,
      data: append ? [...(state?.data || []), ...insert].slice(1, count) : [...insert, ...(state?.data || [])].slice(0, count),
    };
  }

  public static bulkUpdate<T>(update: Array<T>, state: BaseRecords<T>, uniqueKey: Id = 'id'): BaseRecords<T> {
    return {
      ...state,
      data: state.data.map((item: T) => update.find((updateItem: T) => updateItem[uniqueKey as keyof T] === item[uniqueKey as keyof T]) || item),
    };
  }
}
