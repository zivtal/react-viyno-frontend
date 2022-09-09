import axios from "axios";
import { getLoggedinUser } from "../../pages/Login/service/auth.service";

export const minMax = (num, min, max) => Math.max(Math.min(num, max), min);

export const validYear = (year) => !!/^\d{4}$/g.exec(year);

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export async function getCurrentPosition() {
  return {}; // temporary disabled due non-free geo ip lookup service

  const user = getLoggedinUser();
  const res = await axios.get("https://json.geoiplookup.io");
  const { latitude: lat, longitude: lng, country_name: country } = res?.data;

  if (user) {
    return {
      lat: lat || user?.lat,
      lng: lng || user?.lng,
      country: country || user?.country,
    };
  }

  try {
    const geolocation = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (coords) => {
          resolve(coords);
        },
        (err) => {
          reject(err);
        }
      );
    });

    return {
      lat: geolocation.coords.latitude,
      lng: geolocation.coords.longitude,
      country,
    };
  } catch (err) {
    try {
      return { lat, lng, country };
    } catch (err) {}
  }
}

export function getShortSentence(str, length = 48) {
  if (str.length < length) return str.charAt(0).toUpperCase() + str.slice(1);
  var res = str.substr(0, length);
  res = str.substr(0, Math.min(res.length, res.lastIndexOf(" ")));
  return res.charAt(0).toUpperCase() + res.slice(1) + "...";
}

export function typeOf(obj) {
  return /[\s-]\w+(|\])/.exec(Object.prototype.toString.call(obj))[0].trim();
}

export function makeId(length = 8) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
