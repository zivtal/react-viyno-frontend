// @ts-ignore
import { httpService } from "../../../shared/services/http-client/http.service";
import { BaseQueries } from "../../../shared/models/base-queries";
import { WineryQuery } from "../models/winery.model";
import { GET_WINERIES, GET_WINERY } from "../store/types";

const BASE_API = "winery/";

export const wineryService = {
  [GET_WINERIES]: (queries?: BaseQueries) => {
    return httpService.post(BASE_API + GET_WINERIES, queries);
  },

  [GET_WINERY]: (id: number | string, queries?: WineryQuery) => {
    return httpService.post(BASE_API + GET_WINERY + "/" + id, queries);
  },
};
