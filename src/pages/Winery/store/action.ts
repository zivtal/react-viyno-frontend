import { wineryService } from "../service/winery.service";
import {
  ADD_WINERY_CACHE,
  GET_WINERIES,
  GET_WINERY,
  SET_MOST_POPULAR_WINES,
  SET_TOP_RATED_WINES,
  SET_WINERIES,
  SET_WINERIES_LOADING,
  WINERIES_CACHE,
  WINERIES_FILTER,
  WINERIES_SORT,
} from "./types";
import { Winery, WineryQuery } from "../models/winery.model";
import { wineService } from "../../Wine/service/wine.service";
import { GET_WINES } from "../../Wine/store/types";

export function getWinery(id: string | number, queries?: WineryQuery) {
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
      const wineries = await wineryService[GET_WINERIES]({
        filter,
        sort,
        page,
      });
      dispatch({ type: SET_WINERIES, ...wineries });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINERIES_LOADING, loading: false });
    }
  };
}

export function getMostPopularWines(wineryName: string) {
  return async (dispatch: Function) => {
    const wines = await wineService[GET_WINES]({
      filter: { eqWinery: wineryName },
      sort: { ratings: 0 },
    });

    dispatch({ type: SET_MOST_POPULAR_WINES, name: wineryName, wines });
  };
}

export function getTopRatedWines(wineryName: string) {
  return async (dispatch: Function) => {
    const wines = await wineService[GET_WINES]({
      filter: { eqWinery: wineryName },
      sort: { rate: 0 },
    });

    dispatch({ type: SET_TOP_RATED_WINES, name: wineryName, wines });
  };
}
