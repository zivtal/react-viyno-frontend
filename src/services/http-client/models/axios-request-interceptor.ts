import { AxiosError, AxiosRequestConfig } from 'axios';

export interface AxiosRequestInterceptor {
  onFulfilled: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected: (error: AxiosError) => AxiosError | Promise<AxiosError>;
}
