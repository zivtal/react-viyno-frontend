export default class DebounceService {
  private static CACHE: {
    [key: string | number]: ReturnType<typeof setTimeout>;
  } = {};

  public static delete(id: number | string) {
    delete this.CACHE[id];
  }

  public static set(
    fn: () => void,
    id: number | string = 0,
    delay = 500
  ): void {
    clearTimeout(this.CACHE[id]);
    this.delete(id);

    return ((...args) => {
      this.CACHE[id] = setTimeout(() => {
        this.delete(id);

        fn?.(...args);
      }, delay);
    })();
  }
}
