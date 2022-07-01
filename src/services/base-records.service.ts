import { BaseRecords } from "../shared/models/base-records.model";

const append = <T>(
  insert?: BaseRecords<T>,
  state?: BaseRecords<T>,
  uniqueKey?: string
): BaseRecords<T> => {
  if (!state || !insert?.page?.index) {
    return (insert || state) as BaseRecords<T>;
  }

  return {
    data: uniqueKey
      ? [
          ...(state?.data?.filter(
            ({ [uniqueKey]: val1 }: any) =>
              !insert.data?.find(({ [uniqueKey]: val2 }: any) => val1 === val2)
          ) || []),
          ...(insert.data || []),
        ]
      : [...(state.data || []), ...(insert.data || [])],
    page: insert.page || state?.page,
    total: insert.total || state?.total,
  };
};

const insert = <T>(
  insert?: BaseRecords<T>,
  state?: BaseRecords<T>,
  uniqueKey?: string
): BaseRecords<T> => {
  if (!state || !insert?.page?.index) {
    return (insert || state) as BaseRecords<T>;
  }

  return {
    data: uniqueKey
      ? [
          ...(insert?.data || []),
          ...(state?.data?.filter(
            ({ [uniqueKey]: val1 }: any) =>
              !insert.data?.find(({ [uniqueKey]: val2 }: any) => val1 === val2)
          ) || []),
        ]
      : [...(insert?.data || []), ...(state?.data || [])],
    page: insert?.page || state?.page,
    total: insert?.total || state?.total,
  };
};

const overwrite = <T>(
  insert?: BaseRecords<T>,
  state?: BaseRecords<T>,
  uniqueKey?: string
): BaseRecords<T> => {
  if (!state || !insert?.page?.index) {
    return (insert || state) as BaseRecords<T>;
  }

  return {
    data: uniqueKey
      ? [
          ...(insert?.data || []),
          ...(state?.data?.filter(
            ({ [uniqueKey]: val1 }: any) =>
              !insert?.data?.find(({ [uniqueKey]: val2 }: any) => val1 === val2)
          ) || []),
        ].slice(0, state?.data.length || insert?.data.length)
      : [...(insert?.data || []), ...(state?.data || [])].slice(
          0,
          state?.data.length || insert?.data.length
        ),
    page: state?.page || insert?.page,
    total: state?.total || insert?.total,
  };
};

const update = <T>(
  state: BaseRecords<T>,
  unique: {
    key: string;
    value: any;
    recursiveKey?: string;
  },
  insert: any = {},
  counters?: {
    [key: string]: string;
  }
): BaseRecords<T> => {
  return {
    ...state,
    data: state.data.map((content: any): T => {
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
            [unique.recursiveKey]: update(
              content[unique.recursiveKey] as BaseRecords<T>,
              unique,
              insert,
              counters
            ),
          }
        : content;
    }),
  };
};

export const baseRecords = {
  append,
  insert,
  overwrite,
  update,
};
