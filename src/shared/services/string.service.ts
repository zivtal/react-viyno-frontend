export default class StringService {
  public static toUniqueId(text: string): string {
    return [...text].reduce((sum: number, char: string, index: number): number => sum + char.charCodeAt(0) ** ((index % 10) + 1), 0).toString(16);
  }

  public static toHslColor(value: string, s: number = 30, l: number = 80): string {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;

    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  public static toHex = (text: string) => {
    const step1 = (value: string) => [...value].map((char) => char.charCodeAt(0))[0];
    const step2 = (value: number) => ('0' + value.toString(16)).substr(-2);

    return [...text].map(step1).map(step2).join('');
  };

  public static fromHex = (text: string) => {
    const revert2 = (value: string) => parseInt(value, 16);
    const revert1 = (value: number) => String.fromCharCode(value);

    return text
      .match(/.{1,2}/g)
      ?.map(revert2)
      .map(revert1)
      .join('');
  };

  public static toKebabCase(value?: string, validCharsets: boolean = false): string | null {
    if (!value) {
      return null;
    }

    return ((validCharsets ? this.replaceInvalidCharsets(value) : value) || '').replace(/([a-z])([A-Z])|\s/g, '$1-$2').toLowerCase() || null;
  }

  public static fromKebabCase(value?: string): string | null {
    return (
      value
        ?.split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || null
    );
  }

  public static toCamelCase(value?: string, validCharsets: boolean = false): string | null {
    return value
      ? ((validCharsets ? this.replaceInvalidCharsets(value) : value) || '')
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
          .replace(/\s+/g, '') || null
      : null;
  }

  public static fromCamelCase(value?: string, upperOnlyFirst = true): string | null {
    return (
      value
        ?.replace(/[A-Z]/g, (letter) => (upperOnlyFirst ? ` ${letter.toLowerCase()}` : ` ${letter}`))
        ?.replace(/[a-z]/, (letter) => letter.toUpperCase()) || null
    );
  }

  public static extractConditionKey(value: string): { key: string; condition: string } {
    const idx = /([A-Z]|_)/g.exec(value)?.index;

    let key = value.slice(idx);
    key = key.charAt(0).toLowerCase() + key.slice(1);

    return { key, condition: value.slice(0, idx) };
  }

  private static replaceInvalidCharsets(value: string): string | void {
    return value
      .replace(/(.*?)\s([\d]{4}\s)/gi, '') // remove year
      .replace(/\s\((.*?)\)|\./gi, '') // remove spaces
      .replace(/-/g, ' ') // remove separators
      .replace(/&/g, 'and') // change and symbol
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
