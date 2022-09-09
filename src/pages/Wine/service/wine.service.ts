// @ts-ignore
import { httpService } from "../../../shared/services/http-client/http.service";
import {
  ADD_WINE,
  GET_WINE,
  GET_WINE_KEYWORDS,
  GET_WINES,
  SEARCH_WINES,
} from "../store/types";
import { WineKeywordsReq, Wine, WineQuery } from "../models/wine.model";
import { BaseRecordsModel } from "../../../shared/models/base-records.model";

export const wineService = {
  [GET_WINE]: (id: string, queries: any): Promise<Wine> => {
    return httpService.post(BASE_API + GET_WINE + "/" + id, queries);
  },

  [SEARCH_WINES]: (queries?: WineQuery): Promise<BaseRecordsModel<Wine>> => {
    queries = _clearEmptyQueries(queries);

    return httpService.post(BASE_API + SEARCH_WINES, queries);
  },

  [GET_WINES]: (queries?: WineQuery): Promise<BaseRecordsModel<Wine>> => {
    queries = _clearEmptyQueries(queries);

    return httpService.post(BASE_API + GET_WINES, queries);
  },

  [GET_WINE_KEYWORDS]: (queries?: WineKeywordsReq) => {
    queries = _clearEmptyQueries(queries);

    return httpService.get(BASE_API + GET_WINE_KEYWORDS, queries);
  },

  [ADD_WINE]: (wine: Wine) => {
    return httpService.post(BASE_API + ADD_WINE, wine);
  },
};

const BASE_API = "wine/";

const _cleanUpEmptyFields = (obj: {}) => {
  const typeOf = (obj: any): any => Object.prototype.toString.call(obj);

  return Object.entries(obj).reduce((q: any, p: any) => {
    const key = p[0];
    const val = p[1];
    if (typeOf(val) !== "[object Object]" || Object.values?.length)
      q = { ...q, [key]: val };

    return q;
  }, {});
};

const _cleanUpEmptyEntries = (obj: {}): any => {
  return Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]: any) =>
      String(value) !== "[object Object]"
        ? [[key, value]]
        : ((value = _cleanUpEmptyEntries(value)),
          Object.keys(value).length > 0 ? [[key, value]] : [])
    )
  );
};

function _clearEmptyQueries(queries: any) {
  if (!queries) {
    return;
  }

  return _cleanUpEmptyEntries(_cleanUpEmptyFields(queries));
}

async function getWineUpdate(
  queries?: WineQuery
): Promise<BaseRecordsModel<Wine>> {
  queries = _clearEmptyQueries(queries);
  return httpService.get(BASE_API + GET_WINES, null, queries);
}
