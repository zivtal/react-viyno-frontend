// @ts-ignore
import { httpService } from "../../../services/http-client/http.service";
import { BaseQueries } from "../../../shared/models/base-queries";
import { BaseRecords } from "../../../shared/models/base-records.model";
import { Winery } from "../models/winery.models";
import { GET_WINERIES, GET_WINERY } from "../store/types";

const BASE_API = "winery/";

export const wineryService = {
  [GET_WINERIES]: (queries?: BaseQueries) => {
    return httpService.get(BASE_API + GET_WINERIES, queries);
  },

  [GET_WINERY]: (id: number | string) => {
    return httpService.get(BASE_API + id);
  },

  query: getWineries,
  getById: getWinery,
};

async function getWineries(queries: BaseQueries): Promise<BaseRecords<Winery>> {
  return httpService.get(BASE_API, null, queries);
}

async function getWinery(
  id: number | string,
  queries: BaseQueries
): Promise<Winery> {
  return httpService.get(BASE_API + id, null, queries);
}
