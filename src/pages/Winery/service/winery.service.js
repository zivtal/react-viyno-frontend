import { httpService } from '../../../services/http-client/http.service';

export const wineryService = {
  query,
  getById
};

const BASE_API = 'winery/';

async function query(queries) {
  return httpService.get(BASE_API, null, queries);
}

async function getById(id, queries) {
  try {
    return httpService.get(BASE_API + id, null, queries);
  } catch (err) {
    console.error(err);
  }
}
