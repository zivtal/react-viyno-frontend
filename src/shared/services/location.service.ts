interface Location {
  lat: number;
  lng: number;
}

export function getDistanceInKm(
  location1: Location,
  location2: Location
): number {
  const p = Math.PI / 180;
  const r = 6371;
  const cos = Math.cos;
  const a =
    0.5 -
    cos((location2.lat - location1.lat) * p) / 2 +
    (cos(location1.lat * p) *
      cos(location2.lat * p) *
      (1 - cos((location2.lng - location1.lng) * p))) /
      2;

  return Math.round(2 * r * Math.asin(Math.sqrt(a)));
}
