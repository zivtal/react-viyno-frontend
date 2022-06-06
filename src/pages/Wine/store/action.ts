import { wineService } from "../service/wine.service";
import {
  SET_WINES_FILTER,
  SET_WINE_KEYWORDS,
  SET_WINES,
  SET_WINE_SORT,
  SET_WINE_SECTION,
  SET_WINE,
  SET_WINES_PAGINATION,
  SET_WINES_LOADING,
  WINES_SORT,
  WINES_FILTER,
  WINE_KEYWORDS,
  WINE_SECTIONS,
  WINES,
  WINE,
} from "./types";
import { CLEAR_WINE_REVIEWS } from "../../UserFeed/store/types";
import { Pagination } from "../../../shared/models/pagination";
import { BaseFilter } from "../../../shared/models/base-filter";
import { BaseSort } from "../../../shared/models/base-sort";
import { WineKeywordsReq } from "../models/wine.models";

export const setPagination = (pagination: Pagination) => {
  return (dispatch: Function) => {
    dispatch({ type: SET_WINES_PAGINATION, pagination });
  };
};

export const setFilter = (filter: BaseFilter) => {
  return (dispatch: Function) => {
    filter = Object.fromEntries(
      Object.entries(filter).filter(([key, val]) => val)
    );
    dispatch({ type: SET_WINES_FILTER, [WINES_FILTER]: filter });
  };
};

export const setSortBy = (sort: BaseSort) => {
  return (dispatch: Function) => {
    sort = Object.fromEntries(
      Object.entries(sort).filter(([key, val]) => val !== null)
    );
    dispatch({ type: SET_WINE_SORT, [WINES_SORT]: sort });
  };
};

export const setKeywords = (keywords?: WineKeywordsReq) => {
  return (dispatch: Function) => {
    dispatch({ type: SET_WINE_KEYWORDS, [WINE_KEYWORDS]: keywords });
  };
};

export const setSection = (section?: { [key: string]: string }) => {
  return (dispatch: Function) => {
    dispatch({ type: SET_WINE_SECTION, [WINE_SECTIONS]: section });
  };
};

export const getWines = () => {
  return async (dispatch: Function, state: Function) => {
    const { filter, sort, page } = state().wineModule;
    try {
      dispatch({ type: SET_WINES_LOADING, loading: true });
      const wines = await wineService.getWines({ filter, sort, page });
      dispatch({ type: SET_WINES, [WINES]: wines });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINES_LOADING, loading: false });
    }
  };
};

export const getWine = (id: string, vintage: number) => {
  return async (dispatch: Function) => {
    try {
      dispatch({ type: SET_WINES_LOADING, loading: true });
      dispatch({ type: CLEAR_WINE_REVIEWS });
      const wine = await wineService.getWine(id, { vintage });
      dispatch({ type: SET_WINE, [WINE]: wine });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINES_LOADING, loading: false });
    }
  };
};
