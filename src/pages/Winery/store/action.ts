// @ts-ignore
import { getCurrentPosition } from "../../../services/util.service";
import { wineryService } from "../service/winery.service";
import {
  ADD_WINERY_CACHE,
  GET_WINERY,
  SET_WINERIES,
  SET_WINERIES_LOADING,
  WINERIES_CACHE,
  WINERIES_FILTER,
  WINERIES_SORT,
} from "./types";
import { Winery, WineryQuery } from "../models/winery.models";
import { wineService } from "../../Wine/service/wine.service";

export function getWinery(id: string | number, queries?: WineryQuery) {
  console.log(queries);
  return async (dispatch: Function, state: Function) => {
    const { [WINERIES_CACHE]: wineries } = state().wineryModule;

    if (wineries.find((winery: Winery) => winery.seo === id)) {
      return;
    }

    try {
      dispatch({ type: SET_WINERIES_LOADING, loading: true });
      const winery = await wineryService[GET_WINERY](id, queries);
      dispatch({ type: ADD_WINERY_CACHE, winery });
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
