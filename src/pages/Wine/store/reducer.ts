import {
  SET_WINES_FILTER,
  SET_WINE_KEYWORDS,
  SET_WINES,
  SET_WINES_SORT,
  SET_WINE_SECTION,
  ADD_WINE,
  REMOVE_WINE,
  UPDATE_WINE,
  CLEAR_WINES,
  SET_WINE,
  SET_WINES_PAGINATION,
  SET_WINES_LOADING,
  WINES,
  WINES_FILTER,
  WINES_SORT,
  WINE_KEYWORDS,
  WINE_SECTIONS,
  WINES_CACHE,
  ADD_WINE_CACHE,
  SET_WINE_HELPFUL_REVIEWS,
  SET_WINE_RECENT_REVIEWS,
  WINE_HELPFUL_REVIEWS,
  WINE_RECENT_REVIEWS,
} from "./types";
import { Wine, WineState } from "../models/wine.model";
import { FullPost } from "../../UserFeed/models/post.model";
import RuntimeBaseRecordsService from "../../../shared/services/runtime-base-records.service";

interface ReducerAction {
  type: string;
  [key: string]: any;
}

const INITIAL_STATE: WineState = {
  [WINES]: [],
  [WINES_FILTER]: {},
  [WINES_SORT]: {},
  [WINE_KEYWORDS]: null,
  [WINE_SECTIONS]: {
    winery: [],
    name: [],
    country: [],
    region: [],
    style: [],
  },
  [WINES_CACHE]: [],
  page: {},
  total: null,
  loading: false,
};

export default (state: WineState = INITIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case SET_WINES_LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }

    case SET_WINES_PAGINATION: {
      return {
        ...state,
        page: action.pagination
          ? { ...state.page, ...action.pagination }
          : INITIAL_STATE.page,
      };
    }

    case SET_WINES_FILTER: {
      const isChanged =
        JSON.stringify(action[WINES_FILTER]) !==
        JSON.stringify(state[WINES_FILTER]);

      return {
        ...state,
        [WINES_FILTER]: action[WINES_FILTER] || INITIAL_STATE[WINES_FILTER],
        [WINES]: isChanged ? INITIAL_STATE[WINES] : state[WINES],
        page: isChanged ? {} : state.page,
        total: isChanged ? 0 : state.total,
      };
    }

    case SET_WINES_SORT: {
      const isChanged =
        JSON.stringify(action[WINES_SORT]) !==
        JSON.stringify(state[WINES_SORT]);

      return {
        ...state,
        [WINES_SORT]: action[WINES_SORT] || INITIAL_STATE[WINES_SORT],
        [WINES]: isChanged ? INITIAL_STATE[WINES] : state[WINES],
        page: isChanged ? INITIAL_STATE.page : state.page,
        total: isChanged ? INITIAL_STATE.total : state.total,
      };
    }

    case SET_WINES: {
      return {
        ...state,
        [WINES]: [...state[WINES], ...action[WINES]?.data],
        page: { ...(action[WINES]?.page || {}) },
        total: action[WINES].total,
      };
    }

    case CLEAR_WINES: {
      return {
        ...state,
        [WINES]: INITIAL_STATE[WINES],
        [WINES_FILTER]: INITIAL_STATE[WINES_FILTER],
        [WINES_SORT]: INITIAL_STATE[WINES_SORT],
        page: INITIAL_STATE.page,
        total: null,
      };
    }

    case SET_WINE: {
      return {
        ...state,
        [WINES_CACHE]: state[WINES_CACHE].map((wine: Wine) => {
          return wine.seo === action.wine?.seo || wine._id === action.wine?._id
            ? { ...wine, ...action.wine }
            : wine;
        }),
      };
    }

    case SET_WINE_HELPFUL_REVIEWS: {
      return {
        ...state,
        [WINES_CACHE]: state[WINES_CACHE].map((wine: Wine) => {
          const helpfulReviews = RuntimeBaseRecordsService.append<FullPost>(
            action[WINE_HELPFUL_REVIEWS],
            wine[WINE_HELPFUL_REVIEWS],
            "_id"
          );

          return wine.seo === action.wineSeo || wine._id === action.wineId
            ? {
                ...wine,
                [WINE_HELPFUL_REVIEWS]: helpfulReviews,
              }
            : wine;
        }),
      };
    }

    case SET_WINE_RECENT_REVIEWS: {
      return {
        ...state,
        [WINES_CACHE]: state[WINES_CACHE].map((wine: Wine) => {
          const recentReviews = RuntimeBaseRecordsService.append<FullPost>(
            action[WINE_RECENT_REVIEWS],
            wine[WINE_RECENT_REVIEWS],
            "_id"
          );

          return wine.seo === action.wineSeo || wine._id === action.wineId
            ? {
                ...wine,
                [WINE_RECENT_REVIEWS]: recentReviews,
              }
            : wine;
        }),
      };
    }

    case ADD_WINE_CACHE: {
      if (!action.wine) {
        return;
      }

      return {
        ...state,
        [WINES_CACHE]: [action.wine, ...state[WINES_CACHE]].slice(0, 20),
      };
    }

    case SET_WINE_KEYWORDS: {
      return {
        ...state,
        [WINE_KEYWORDS]: action[WINE_KEYWORDS],
      };
    }

    case SET_WINE_SECTION: {
      return {
        ...state,
        [WINE_SECTIONS]: { ...state[WINE_SECTIONS], ...action[WINE_SECTIONS] },
      };
    }

    case ADD_WINE: {
      return {
        ...state,
        [WINES]: [...state[WINES], action.wine],
      };
    }

    case REMOVE_WINE: {
      return {
        ...state,
        [WINES]: state[WINES].filter((wine) => wine._id !== action.wineId),
      };
    }

    case UPDATE_WINE: {
      return {
        ...state,
        [WINES]: state.wines.map((wine) =>
          wine._id === action.wine._id ? action.wine : wine
        ),
      };
    }

    default:
      return state;
  }
};
