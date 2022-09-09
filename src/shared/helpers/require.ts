const REQUIRE_CACHE: any = {};

export function tryRequire(path: string, alt?: string): string {
  try {
    REQUIRE_CACHE[path] ??= require(`../../assets/${path}`);

    return REQUIRE_CACHE[path];
  } catch (err) {
    return alt ? tryRequire(alt) : "";
  }
}
