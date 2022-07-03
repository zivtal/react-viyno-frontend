import { SET_USER } from "./types";
import { User } from "../models/auth.model";

export function setUser(user: User | null): (dispatch: any) => Promise<void> {
  return async (dispatch: any): Promise<void> => {
    try {
      dispatch({ type: SET_USER, user });
    } catch (err) {
      console.error(err);
    }
  };
}
