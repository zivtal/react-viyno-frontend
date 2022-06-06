export const cleanUpEmptyFields = (obj: {}): any =>
  Object.entries(obj).reduce((q: any, p: any) => {
    const key = p[0];
    const value = p[1];

    if (String(value) !== "[object Object]" || Object.values?.length) {
      q = { ...q, [key]: value };
    }

    return q;
  }, {});

export const cleanUpEmptyEntries = (obj: {}): any =>
  Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]: any) =>
      String(value) !== "[object Object]"
        ? [[key, value]]
        : ((value = cleanUpEmptyEntries(value)),
          Object.keys(value).length > 0 ? [[key, value]] : [])
    )
  );
