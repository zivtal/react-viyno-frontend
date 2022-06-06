// @ts-ignore
import { getCurrentPosition } from "../../../services/util.service";
import { wineryService } from "../service/winery.service";
import { SET_WINERIES, SET_WINERY } from "./types";

export function loadWineries() {
  return async (dispatch: Function, getState: Function) => {
    const { filterBy } = getState().wineryModule;
    try {
      const wineries = await wineryService.query(filterBy);
      dispatch({ type: SET_WINERIES, wineries });
    } catch (err) {
      console.error(err);
    }
  };
}

export function loadWinery(id: string | number) {
  return async (dispatch: Function) => {
    try {
      const location = await getCurrentPosition();
      const winery = await wineryService.getById(id, { ...location });
      dispatch({ type: SET_WINERY, winery });
    } catch (err) {
      console.error(err);
    }
  };
}
