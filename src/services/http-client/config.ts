import { AxiosRequestConfig } from 'axios';

const globalConfig: AxiosRequestConfig = {
  baseURL: process.env.VUE_APP_ROOT_API || '',
  timeout: Number(process.env.VUE_APP_HTTP_TIMEOUT_MILLISECONDS) || 30000,
  headers: {
    'Content-Type': 'application/json',
    VER: '1',
  },
};

export default globalConfig;
