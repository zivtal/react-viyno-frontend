import { AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosRequestInterceptor } from '../models/axios-request-interceptor'

export const addLanguageInterceptor: AxiosRequestInterceptor = {
  onFulfilled: (request: AxiosRequestConfig) => {
    // const currentLanguage = store.getters[LANGUAGE];
    //
    // if (currentLanguage) {
    //   (request.headers || {}).lang = currentLanguage;
    // }

    return request;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
