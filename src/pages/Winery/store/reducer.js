import { SET_WINERIES, SET_WINERY } from "./types";

const INITIAL_STATE = {
  winery: null,
  wineries: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_WINERIES:
      return {
        ...state,
        wineries: [...action.wineries.data],
        page: { ...action.wineries.page },
        total: action.wineries.total,
      };
    case SET_WINERY:
      return {
        ...state,
        winery: action.winery
      };
    default:
      return state;
  }
}
