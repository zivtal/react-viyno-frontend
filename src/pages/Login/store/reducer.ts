import { authService } from "../service/auth.service";
import { SET_USER } from "./types";
import { User } from "../models/auth.model";

export interface AuthState {
  user: User | null;
}

const INITIAL_STATE: AuthState = {
  user: authService.getLoggedinUser(),
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};
