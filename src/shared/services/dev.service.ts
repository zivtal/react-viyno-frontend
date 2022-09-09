export interface ConditionKey {
  key: string;
  condition: string;
}

export function sentenceToKebabCase(value?: string): string | null {
  if (!value) {
    return null;
  }

  return (
    (
      value.match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      ) || []
    )
      .map((word) => word.toLowerCase())
      .join("-") || null
  );
}

export function sentenceToCamelCase(value?: string): string | null {
  if (!value) {
    return null;
  }

  return value
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function camelCaseToSentence(
  value?: string | Array<string>,
  upperOnlyFirst = true
): string | null {
  if (!value) {
    return null;
  }

  value = Array.isArray(value) ? value : [value];

  return value
    .map((key: string) =>
      key
        .replace(/[A-Z]/g, (letter) =>
          upperOnlyFirst ? ` ${letter.toLowerCase()}` : ` ${letter}`
        )
        .replace(/[a-z]/, (letter) => letter.toUpperCase())
    )
    .join(" » ");
}

export function kebabCaseToSentence(value: string): string | null {
  if (!value) {
    return null;
  }

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toKebabCase(value?: string): string | null {
  if (!value) {
    return null;
  }

  return (
    value
      .replaceAll("&", "and")
      .replace(/(.*?)\s([\d]{4}\s)/gi, "")
      .replace(/\s\((.*?)\)/gi, "")
      .replace(/-/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      ) || []
  )
    .map((w) => w.toLowerCase())
    .join("-");
}

export function extractConditionKey(cKey: string): ConditionKey {
  const idx = /([A-Z]|_)/g.exec(cKey)?.index;

  let key = cKey.slice(idx);
  key = key.charAt(0).toLowerCase() + key.slice(1);

  let condition = cKey.slice(0, idx);

  return { key, condition };
}
