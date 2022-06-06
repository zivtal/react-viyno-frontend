import { SET_USER } from "./types";
import { User } from "../models/login";

export function setUser(user: User): (dispatch: any) => Promise<void> {
  return async (dispatch: any): Promise<void> => {
    try {
      dispatch({ type: SET_USER, user });
    } catch (err) {
      console.error(err);
    }
  };
}
