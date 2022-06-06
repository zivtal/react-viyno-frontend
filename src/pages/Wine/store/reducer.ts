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
  WINE,
  WINE_SECTIONS,
  WINES_CACHE,
  ADD_WINE_CACHE,
} from "./types";
import { Wine, WineKeywords } from "../models/wine.models";
import { BaseSort } from "../../../shared/models/base-sort";
import { BaseFilter } from "../../../shared/models/base-filter";
import { WineSections } from "../models/wine.models";
import { Pagination } from "../../../shared/models/pagination";
import { WINERIES_SORT } from "../../Winery/store/types";

interface ReducerAction {
  type: string;
  [key: string]: any;
}

export interface PostState {
  [WINE]: Wine | null;
  [WINES]: Array<Wine>;
  [WINES_FILTER]: BaseFilter;
  [WINES_SORT]: BaseSort;
  [WINE_KEYWORDS]: WineKeywords | null;
  [WINE_SECTIONS]: WineSections;
  [WINES_CACHE]: Array<Wine>;
  page: Pagination;
  total: number | null;
  loading: boolean;
}

const INITIAL_STATE: PostState = {
  [WINE]: null,
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

export default (state: PostState = INITIAL_STATE, action: ReducerAction) => {
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
        page: isChanged ? INITIAL_STATE.page : state.page,
        total: isChanged ? INITIAL_STATE.total : state.total,
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
        [WINES_CACHE]: state[WINES_CACHE].map((wine: Wine) =>
          wine.seo !== action.wine.seo ? wine : { ...wine, ...action.wine.seo }
        ),
      };
    }

    case ADD_WINE_CACHE: {
      return {
        ...state,
        [WINES_CACHE]: [action[WINE], ...state[WINES_CACHE]].slice(0, 20),
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
