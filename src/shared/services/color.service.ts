export function stringToHslColor(
  value: string,
  s: number = 30,
  l: number = 80
): string {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;

  return "hsl(" + h + ", " + s + "%, " + l + "%)";
}
