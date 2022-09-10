export const minMax = (num: number, min: number, max: number): number =>
  Math.max(Math.min(num, max), min);

export const validYear = (year: string): boolean => !!/^\d{4}$/g.exec(year);

export function deepCopy(obj: any): string {
  return JSON.parse(JSON.stringify(obj));
}

export function getShortSentence(value: string, length = 48): string {
  if (value.length < length)
    return value.charAt(0).toUpperCase() + value.slice(1);
  let res = value.substr(0, length);
  res = value.substr(0, Math.min(res.length, res.lastIndexOf(" ")));
  return res.charAt(0).toUpperCase() + res.slice(1) + "...";
}

export function makeId(length = 8): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
