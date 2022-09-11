// @ts-ignore
import { httpService } from '../../../shared/services/http.service';
import { ADD_WINE, GET_WINE, GET_WINE_KEYWORDS, GET_WINES, SEARCH_WINES } from '../store/types';
import { WineKeywordsReq, Wine, WineQuery } from '../models/wine.model';
import { BaseRecords } from '../../../shared/interfaces/base-records';
import ObjectService from '../../../shared/services/object.service';

export const wineService = {
  [GET_WINE]: (id: string, queries: any): Promise<Wine> => {
    return httpService.post(BASE_API + GET_WINE + '/' + id, queries);
  },

  [SEARCH_WINES]: (queries?: WineQuery): Promise<BaseRecords<Wine>> => {
    return httpService.post(BASE_API + SEARCH_WINES, ObjectService.clean(queries));
  },

  [GET_WINES]: (queries?: WineQuery): Promise<BaseRecords<Wine>> => {
    return httpService.post(BASE_API + GET_WINES, ObjectService.clean(queries));
  },

  [GET_WINE_KEYWORDS]: (queries?: WineKeywordsReq) => {
    return httpService.get(BASE_API + GET_WINE_KEYWORDS, ObjectService.clean(queries));
  },

  [ADD_WINE]: (wine: Wine) => {
    return httpService.post(BASE_API + ADD_WINE, wine);
  },
};

const BASE_API = 'wine/';

// TODO: Temporary disabled
// async function getWineUpdate(queries?: WineQuery): Promise<BaseRecords<Wine>> {
//   queries = _clearEmptyQueries(queries);
//   return httpService.get(BASE_API + GET_WINES, null, queries);
// }
