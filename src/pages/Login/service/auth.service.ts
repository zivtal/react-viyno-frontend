// @ts-ignore
import { httpService } from "../../../services/http-client/http.service";
// @ts-ignore
import { getCurrentPosition } from "../../../services/util.service";
import { Login, User } from "../models/login";
import { LOGIN, LOGOUT, SIGNUP } from "../store/types";

const STORAGE_KEY_LOGGEDIN_USER = "user";

const API = "auth";

export const authService = {
  [LOGIN]: async (user: Login) => {
    try {
      const loggedInUser: User = await httpService.post(
        API + "/login",
        user,
        await getCurrentPosition()
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

  [SIGNUP]: async (user: Login) => {
    try {
      const signedUser = await httpService.post(
        "auth/signup",
        user,
        await getCurrentPosition()
      );

      return _saveLocalUser(signedUser);
    } catch (err) {
      console.error(err);
    }
  },

  getLoggedinUser,
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
