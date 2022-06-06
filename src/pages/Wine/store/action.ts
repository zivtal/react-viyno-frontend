import { wineService } from "../service/wine.service";
import {
  SET_WINES_FILTER,
  SET_WINE_KEYWORDS,
  SET_WINES,
  SET_WINES_SORT,
  SET_WINE_SECTION,
  SET_WINES_PAGINATION,
  SET_WINES_LOADING,
  WINES_SORT,
  WINES_FILTER,
  WINE_KEYWORDS,
  WINE_SECTIONS,
  WINES,
  WINES_CACHE,
  ADD_WINE_CACHE,
  GET_WINES,
  GET_WINE,
} from "./types";
import { CLEAR_WINE_REVIEWS } from "../../UserFeed/store/types";
import { Pagination } from "../../../shared/models/pagination";
import { BaseFilter } from "../../../shared/models/base-filter";
import { BaseSort } from "../../../shared/models/base-sort";
import { Wine, WineKeywordsReq } from "../models/wine.model";

export const setWinesPagination = (pagination: Pagination) => {
  return (dispatch: Function) => {
    dispatch({ type: SET_WINES_PAGINATION, pagination });
  };
};

export const setWinesFilter = (filter: BaseFilter) => {
  return (dispatch: Function) => {
    filter = Object.fromEntries(
      Object.entries(filter).filter(([key, val]) => val)
    );
    dispatch({ type: SET_WINES_FILTER, [WINES_FILTER]: filter });
  };
};

export const setWinesSort = (sort: BaseSort) => {
  return (dispatch: Function) => {
    sort = Object.fromEntries(
      Object.entries(sort).filter(([key, val]) => val !== null)
    );
    dispatch({ type: SET_WINES_SORT, [WINES_SORT]: sort });
  };
};

export const setWinesKeywords = (keywords?: WineKeywordsReq) => {
  return (dispatch: Function) => {
    dispatch({ type: SET_WINE_KEYWORDS, [WINE_KEYWORDS]: keywords });
  };
};

export const setWineSection = (section?: { [key: string]: string }) => {
  return (dispatch: Function) => {
    dispatch({ type: SET_WINE_SECTION, [WINE_SECTIONS]: section });
  };
};

export const getWines = () => {
  return async (dispatch: Function, state: Function) => {
    const { filter, sort, page } = state().wineModule;

    if (page.index !== undefined) {
      page.index++;
    }

    try {
      dispatch({ type: SET_WINES_LOADING, loading: true });
      const wines = await wineService[GET_WINES]({ filter, sort, page });
      dispatch({ type: SET_WINES, [WINES]: wines });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINES_LOADING, loading: false });
    }
  };
};

export const getWine = (id: string, vintage?: number) => {
  return async (dispatch: Function, state: Function) => {
    const wine = state().wineModule[WINES_CACHE].find(
      (wine: Wine) => wine.seo === id
    );

    if (wine) {
      return;
    }

    try {
      dispatch({ type: SET_WINES_LOADING, loading: true });
      dispatch({ type: CLEAR_WINE_REVIEWS });
      const wine = await wineService[GET_WINE](id, { vintage });
      dispatch({ type: ADD_WINE_CACHE, wine });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINES_LOADING, loading: false });
    }
  };
};
