import { AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosRequestInterceptor } from '../models/axios-request-interceptor'

export const addAccessTokenInterceptor: AxiosRequestInterceptor = {
  onFulfilled: (request: AxiosRequestConfig) => {
    // const accessToken = store.getters[`${StoreNamespace.AUTH_MODULE}/${ACCESS_TOKEN}`];

    // if (accessToken) {
    //   (request.headers || {}).Authorization = `Bearer ${accessToken}`;
    // }
    //
    return request;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
