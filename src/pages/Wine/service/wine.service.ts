// @ts-ignore
import { httpService } from "../../../services/http-client/http.service";
// @ts-ignore
import { typeOf } from "../../../services/util.service";
import {
  ADD_WINE,
  GET_WINE,
  GET_WINE_KEYWORDS,
  GET_WINES,
  SEARCH_WINES,
} from "../store/types";
import { WineKeywordsReq, Wine, WineQuery } from "../models/wine.models";
import { BaseRecords } from "../../../shared/models/base-records.model";

export const wineService = {
  getKeywords,
  searchWines,
  getWines,
  getWine,
  getWineUpdate,
  addWine,
};

const BASE_API = "wine/";

const _cleanUpEmptyFields = (obj: {}) =>
  Object.entries(obj).reduce((q: any, p: any) => {
    const key = p[0];
    const val = p[1];
    if (typeOf(val) !== "Object" || Object.values?.length)
      q = { ...q, [key]: val };

    return q;
  }, {});

const _cleanUpEmptyEntries = (obj: {}): any =>
  Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]: any) =>
      String(value) !== "[object Object]"
        ? [[key, value]]
        : ((value = _cleanUpEmptyEntries(value)),
          Object.keys(value).length > 0 ? [[key, value]] : [])
    )
  );

function _clearEmptyQueries(queries: any) {
  if (!queries) {
    return;
  }

  return _cleanUpEmptyEntries(_cleanUpEmptyFields(queries));
}

async function getKeywords(queries?: WineKeywordsReq) {
  queries = _clearEmptyQueries(queries);

  return httpService.get(BASE_API + GET_WINE_KEYWORDS, null, queries);
}

async function searchWines(queries?: WineQuery): Promise<BaseRecords<Wine>> {
  queries = _clearEmptyQueries(queries);

  return httpService.get(BASE_API + SEARCH_WINES, null, queries);
}

async function getWines(queries?: WineQuery): Promise<BaseRecords<Wine>> {
  queries = _clearEmptyQueries(queries);

  return httpService.get(BASE_API + GET_WINES, null, queries);
}

async function getWine(id: string, queries: any): Promise<Wine> {
  return httpService.get(BASE_API + GET_WINE + "/" + id, null, queries);
}

async function getWineUpdate(queries?: WineQuery): Promise<BaseRecords<Wine>> {
  queries = _clearEmptyQueries(queries);
  return httpService.get(BASE_API + GET_WINES, null, queries);
}

async function addWine(wine: Wine) {
  return httpService.post(BASE_API + ADD_WINE, wine);
}
