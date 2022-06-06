// @ts-ignore
import { getCurrentPosition } from "../../../services/util.service";
import { wineryService } from "../service/winery.service";
import {
  GET_WINERY,
  SET_WINERIES,
  SET_WINERIES_LOADING,
  SET_WINERY,
  WINERIES_FILTER,
  WINERIES_SORT,
  WINERY,
} from "./types";
import { WineryQuery } from "../models/winery.models";
import { wineService } from "../../Wine/service/wine.service";

export function getWinery(id: string | number, queries?: WineryQuery) {
  console.log(queries);
  return async (dispatch: Function, state: Function) => {
    const { [WINERY]: winery } = state().wineryModule;

    if (winery?.seo === id) {
      return;
    }

    try {
      dispatch({ type: SET_WINERIES_LOADING, loading: true });
      dispatch({ type: SET_WINERY });
      const winery = await wineryService[GET_WINERY](id, queries);
      dispatch({ type: SET_WINERY, [WINERY]: winery });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINERIES_LOADING, loading: false });
    }
  };
}

export function getWineries() {
  return async (dispatch: Function, state: Function) => {
    const {
      [WINERIES_FILTER]: filter,
      [WINERIES_SORT]: sort,
      page,
    } = state().wineryModule;

    if (page.index !== undefined) {
      page.index++;
    }

    try {
      dispatch({ type: SET_WINERIES_LOADING, loading: true });
      const wineries = await wineService.getWines({ filter, sort, page });
      dispatch({ type: SET_WINERIES, ...wineries });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINERIES_LOADING, loading: false });
    }
  };
}
