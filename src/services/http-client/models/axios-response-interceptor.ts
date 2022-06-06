import { AxiosError, AxiosResponse } from 'axios';

export interface AxiosResponseInterceptor {
  onFulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onRejected: (error: AxiosError) => AxiosError | Promise<AxiosError> | any;
}
