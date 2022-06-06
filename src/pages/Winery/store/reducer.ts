import {
  SET_WINERIES,
  SET_WINERIES_FILTER,
  SET_WINERIES_LOADING,
  SET_WINERIES_SORT,
  SET_WINERY,
  WINERIES,
  WINERIES_FILTER,
  WINERIES_SORT,
  WINERY,
} from "./types";
import { Winery } from "../models/winery.models";
import { BaseSort } from "../../../shared/models/base-sort";
import { WINES, WINES_FILTER } from "../../Wine/store/types";
import { Pagination } from "../../../shared/models/pagination";

export interface WineryState {
  [WINERY]: Winery | null;
  [WINERIES]: Array<Winery>;
  [WINERIES_SORT]: BaseSort;
  [WINERIES_FILTER]: BaseSort;
  page: Pagination;
  total?: number | null;
}

const INITIAL_STATE = {
  [WINERY]: null,
  [WINERIES]: [],
  [WINERIES_SORT]: {},
  [WINERIES_FILTER]: {},
  page: {},
  total: null,
  loading: false,
};

export default (state: WineryState = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_WINERIES_LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }

    case SET_WINERY: {
      return {
        ...state,
        [WINERY]: action.winery || INITIAL_STATE[WINERY],
      };
    }

    case SET_WINERIES: {
      return {
        ...state,
        [WINERIES]: [...state[WINERIES], ...action.wineries],
        page: { ...(action[WINES]?.page || {}) },
        total: action[WINES].total,
      };
    }

    case SET_WINERIES_FILTER: {
      const isChanged =
        JSON.stringify(action[WINES_FILTER]) !==
        JSON.stringify(state[WINES_FILTER]);

      return {
        ...state,
        [WINERIES_FILTER]:
          action[WINES_FILTER] || INITIAL_STATE[WINERIES_FILTER],
        [WINERIES]: isChanged ? INITIAL_STATE[WINERIES] : state[WINERIES],
        page: isChanged ? INITIAL_STATE.page : state.page,
        total: isChanged ? INITIAL_STATE.total : state.total,
      };
    }

    case SET_WINERIES_SORT: {
      const isChanged =
        JSON.stringify(action[WINERIES_SORT]) !==
        JSON.stringify(state[WINERIES_SORT]);

      return {
        ...state,
        [WINERIES_SORT]: action[WINERIES_SORT] || INITIAL_STATE[WINERIES_SORT],
        [WINERIES]: isChanged ? INITIAL_STATE[WINERIES] : state[WINERIES],
        page: isChanged ? INITIAL_STATE.page : state.page,
        total: isChanged ? INITIAL_STATE.total : state.total,
      };
    }

    default:
      return state;
  }
};
