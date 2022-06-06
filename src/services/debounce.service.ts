interface Debounce {
  [key: number | string]: ReturnType<typeof setTimeout>;
}

const CACHE: Debounce = {};

export function debounce(
  fn: Function,
  id: number | string = 0,
  delay: number = 500
): void {
  clearTimeout(CACHE[id]);
  delete CACHE[id];

  return ((...args) => {
    CACHE[id] = setTimeout(() => {
      delete CACHE[id];
      if (typeof fn === "function") fn(...args);
    }, delay);
  })();
}
