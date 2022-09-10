export default class ProcessService {
  public static debounce(fn: () => void, id: number | string = 0, delay = 500): void {
    clearTimeout(this.CACHE[id]);
    this.delete(id);

    return ((...args) => {
      this.CACHE[id] = setTimeout(() => {
        this.delete(id);

        fn?.(...args);
      }, delay);
    })();
  }

  public static async delay(fn: () => void, ms?: number): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, ms || 0));

    return fn();
  }

  private static CACHE: { [key: string | number]: ReturnType<typeof setTimeout> } = {};

  private static delete(id: number | string) {
    delete this.CACHE[id];
  }
}
