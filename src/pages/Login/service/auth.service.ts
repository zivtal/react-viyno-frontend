// @ts-ignore
import { httpService } from "../../../shared/services/http.service";
// @ts-ignore
import { AuthModel, User } from "../models/auth.model";
import { LOGIN, LOGOUT, SIGNUP } from "../store/types";
import LocationService from "../../../shared/services/location.service";

const STORAGE_KEY_LOGGEDIN_USER = "user";

const API = "auth";

export const authService = {
  [LOGIN]: async (user: AuthModel) => {
    try {
      const loggedInUser: User = await httpService.post(
        API + "/login",
        user,
        await LocationService.current()
      );

      if (loggedInUser) {
        return _saveLocalUser(loggedInUser);
      }
    } catch (err) {
      console.error(err);
    }
  },

  [LOGOUT]: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);

      return httpService.post(API + "/logout");
    } catch (err) {
      console.error(err);
    }
  },

  [SIGNUP]: async (user: AuthModel) => {
    try {
      const signedUser = await httpService.post(
        "auth/signup",
        user,
        await LocationService.current()
      );

      return _saveLocalUser(signedUser);
    } catch (err) {
      console.error(err);
    }
  },

  getLoggedinUser,
  getUserInformation,
};

function _saveLocalUser(user: User) {
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}

export function getLoggedinUser() {
  return JSON.parse(
    sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || "null"
  );
}

export function getUserInformation() {
  return (({ fullname, _id, imageData }) => ({
    userId: _id,
    userName: fullname,
    userPhoto: imageData,
  }))(getLoggedinUser() || {});
}
