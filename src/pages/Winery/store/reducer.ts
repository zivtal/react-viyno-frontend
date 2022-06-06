import {
  SET_WINERIES,
  SET_WINERIES_FILTER,
  SET_WINERIES_SORT,
  SET_WINERY,
  WINERIES,
  WINERIES_FILTER,
  WINERIES_SORT,
  WINERY,
} from "./types";
import { Winery } from "../models/winery.models";
import { BaseRecords } from "../../../shared/models/base-records.model";
import { BaseSort } from "../../../shared/models/base-sort";
import { WINES_FILTER } from "../../Wine/store/types";

export interface WineryState {
  [WINERY]: Winery | null;
  [WINERIES]: BaseRecords<Winery>;
  [WINERIES_SORT]: BaseSort;
  [WINERIES_FILTER]: BaseSort;
}

const INITIAL_STATE = {
  [WINERY]: null,
  [WINERIES]: {
    data: [],
    page: {},
    total: 0,
  },
  [WINERIES_SORT]: {},
  [WINERIES_FILTER]: {},
};

export default (state: WineryState = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_WINERY: {
      return {
        ...state,
        [WINERY]: action.winery,
      };
    }

    case SET_WINERIES: {
      return {
        ...state,
        [WINERIES]: {
          data: [...state[WINERIES].data, ...action.wineries.data],
          page: action.wineries.page,
          total: action.wineries.total,
        },
      };
    }

    case SET_WINERIES_FILTER: {
      return {
        ...state,
        [WINERIES_FILTER]:
          action[WINES_FILTER] || INITIAL_STATE[WINERIES_FILTER],
        [WINERIES]:
          JSON.stringify(action[WINES_FILTER]) ===
          JSON.stringify(state[WINES_FILTER])
            ? state[WINERIES]
            : INITIAL_STATE[WINERIES],
      };
    }

    case SET_WINERIES_SORT: {
      return {
        ...state,
        [WINERIES_SORT]: action[WINERIES_SORT] || INITIAL_STATE[WINERIES_SORT],
        [WINERIES]:
          JSON.stringify(action[WINERIES_SORT]) ===
          JSON.stringify(state[WINERIES_SORT])
            ? state[WINERIES]
            : INITIAL_STATE[WINERIES],
      };
    }

    default:
      return state;
  }
};
