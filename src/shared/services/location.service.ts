import { Coordinates, LocationInfo } from "../models/location";
import axios from "axios";

export default class LocationService {
  public static async current(): Promise<LocationInfo | void> {
    try {
      const geolocation = (await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve(coords);
          },
          (err) => {
            reject(err);
          }
        );
      })) as Coordinates;

      return {
        latitude: geolocation?.latitude,
        longitude: geolocation?.longitude,
      };
    } catch (err) {
      try {
        const res = await axios.get("https://json.geoiplookup.io");
        const { latitude, longitude, country_name: country } = res?.data;

        return { latitude, longitude, country };
      } catch (err) {}
    }
  }

  public static distance(from: Coordinates, to: Coordinates): number {
    const p = Math.PI / 180;
    const r = 6371;
    const cos = Math.cos;
    const a =
      0.5 -
      cos((to.latitude - from.latitude) * p) / 2 +
      (cos(from.latitude * p) *
        cos(to.latitude * p) *
        (1 - cos((to.longitude - from.longitude) * p))) /
        2;

    return Math.round(2 * r * Math.asin(Math.sqrt(a)));
  }
}
