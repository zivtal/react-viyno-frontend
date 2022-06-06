import axios, { AxiosError, AxiosResponse } from 'axios';
import { AxiosResponseInterceptor } from '../models/axios-response-interceptor';

const TIMEOUT_ERROR_CODE = 'ECONNABORTED';

export const handleErrorsInterceptor: AxiosResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => response,
  onRejected: (error: AxiosError) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.code === TIMEOUT_ERROR_CODE) {
      return Promise.reject(error);
    }

    if (!error.response || error.response?.status === 503) {
      // if (router.currentRoute.name !== 'maintenance') {
      //   router.push({ name: 'maintenance' });
      // }

      return Promise.reject(error);
    }

    if (error.response?.status === 500 || error.response?.data?.returnCode === undefined) {
      // if (router.currentRoute.name !== 'runtime-error' && router.currentRoute.name !== RouteNames.LOBBY) {
      //   router.push({ name: 'runtime-error' });
      // }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
};
