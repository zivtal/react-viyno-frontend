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
  SET_WINE,
  SET_WINE_RECENT_REVIEWS,
  SET_WINE_HELPFUL_REVIEWS,
  WINE_RECENT_REVIEWS,
  GET_WINE_RECENT_REVIEWS,
  MY_WINE_REVIEWS,
  GET_MY_WINE_REVIEWS,
  GET_WINE_HELPFUL_REVIEWS,
  WINE_HELPFUL_REVIEWS,
} from "./types";

import { Pagination } from "../../../shared/models/pagination";
import { BaseFilter } from "../../../shared/models/base-filter";
import { BaseSort } from "../../../shared/models/base-sort";
import { Wine, WineKeywordsReq } from "../models/wine.model";
import { postService } from "../../UserFeed/service/post.api-service";
import { SET_MY_REVIEWS } from "../../UserFeed/store/types";

export const setWinesPagination = (pagination?: Pagination) => {
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

    try {
      if (page.index && page.index === page.total - 1) {
        return;
      }

      page.index = page.index + 1 || 0;
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
      const wine = await wineService[GET_WINE](id, { vintage });
      dispatch({ type: ADD_WINE_CACHE, wine });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_WINES_LOADING, loading: false });
    }
  };
};

export function getMyWineReviews(id?: string | number) {
  return async (dispatch: Function, state: Function) => {
    const user = state().authModule.user;

    if (!id || !user) {
      dispatch({ type: SET_MY_REVIEWS, [MY_WINE_REVIEWS]: [] });
      return;
    }

    try {
      const res = await postService[GET_MY_WINE_REVIEWS](id, {
        sort: { createdAt: 0 },
      });
      dispatch({ type: SET_WINE, wine: { _id: id, myReviews: res } });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getRecentReviews(id?: string | number, vintage?: number) {
  return async (dispatch: Function, state: Function) => {
    const queries = vintage ? { filter: { eqVintage: vintage } } : {};

    if (!id) {
      return;
    }

    const index =
      (state().wineModule[WINES_CACHE].find((wine: Wine) => wine._id === id)
        ?.helpfulReviews?.page?.index || -1) + 1;

    try {
      const res = await postService[GET_WINE_RECENT_REVIEWS](id, {
        ...queries,
        page: { index: index, size: 3 },
        sort: { createdAt: 0 },
      });

      dispatch({
        type: SET_WINE_RECENT_REVIEWS,
        wineId: id,
        [WINE_RECENT_REVIEWS]: res,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getHelpfulReviews(id?: string | number, vintage?: number) {
  return async (dispatch: Function, state: Function) => {
    const queries = vintage ? { filter: { eqVintage: vintage } } : {};

    if (!id) {
      return;
    }

    const index =
      (state().wineModule[WINES_CACHE].find((wine: Wine) => wine._id === id)
        ?.helpfulReviews?.page?.index || -1) + 1;

    try {
      const res = await postService[GET_WINE_HELPFUL_REVIEWS](id, {
        ...queries,
        page: { index, size: 3 },
        sort: { likes: 0, replies: 0 },
      });

      dispatch({
        type: SET_WINE_HELPFUL_REVIEWS,
        wineId: id,
        [WINE_HELPFUL_REVIEWS]: res,
      });
    } catch (err) {
      console.error(err);
    }
  };
}
