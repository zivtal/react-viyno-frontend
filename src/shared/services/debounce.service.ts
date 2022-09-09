const CACHE: { [key: string | number]: ReturnType<typeof setTimeout> } = {};

export const debounce = (
  fn: () => void,
  id: number | string = 0,
  delay = 500
): void => {
  clearTimeout(CACHE[id]);
  delete CACHE[id];

  return ((...args) => {
    CACHE[id] = setTimeout(() => {
      delete CACHE[id];

      fn?.(...args);
    }, delay);
  })();
};
