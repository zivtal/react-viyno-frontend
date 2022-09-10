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
    const text = validCharsets ? this.replaceInvalidCharsets(value) : value;

    return (
      text
        ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map((w) => w.toLowerCase())
        .join('-') || null
    );
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
    const text = validCharsets ? this.replaceInvalidCharsets(value) : value;

    return (
      text?.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))?.replace(/\s+/g, '') || null
    );
  }

  public static fromCamelCase(value?: string, upperOnlyFirst = true): string | null {
    return (
      value
        ?.replace(/[A-Z]/g, (letter) => (upperOnlyFirst ? ` ${letter.toLowerCase()}` : ` ${letter}`))
        ?.replace(/[a-z]/, (letter) => letter.toUpperCase()) || null
    );
  }

  public static extractConditionKey(cKey: string): {
    key: string;
    condition: string;
  } {
    const idx = /([A-Z]|_)/g.exec(cKey)?.index;

    let key = cKey.slice(idx);
    key = key.charAt(0).toLowerCase() + key.slice(1);

    return { key, condition: cKey.slice(0, idx) };
  }

  private static replaceInvalidCharsets(value?: string): string | void {
    return value
      ?.replaceAll('&', 'and') // change and symbol
      .replace(/(.*?)\s([\d]{4}\s)/gi, '') // remove year
      .replace(/\s\((.*?)\)/gi, '') // remove spaces
      .replace(/-/g, '') // remove separators
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
