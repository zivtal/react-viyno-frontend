import { AxiosError, AxiosResponse } from 'axios';
import { AxiosResponseInterceptor } from '../models/axios-response-interceptor'

export const removeReturnCodeInterceptor: AxiosResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    if (response?.data?.returnCode === 0) {
      // tslint:disable-next-line
      delete response.data.returnCode;
    }

    return response;
  },
  onRejected: (error: AxiosError) => Promise.reject(error),
};
