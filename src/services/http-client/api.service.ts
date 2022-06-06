import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ServerError from './server-error';
import { ABORT_ERROR } from './constants';
import { AxiosRequestInterceptor } from './models/axios-request-interceptor';
import { AxiosResponseInterceptor } from './models/axios-response-interceptor';

export default class ApiService {
  private static async makeRequest<T>(request: () => Promise<AxiosResponse>): Promise<T> {
    try {
      const { data } = await request();

      return data;
    } catch (e: any) {
      if (axios.isCancel(e)) {
        throw new ServerError(e, ABORT_ERROR);
      }

      throw new ServerError(e);
    }
  }

  public constructor(config: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config);
  }

  private readonly axiosInstance: AxiosInstance;

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return await ApiService.makeRequest<T>(() => this.axiosInstance.get<T>(url, config));
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return await ApiService.makeRequest<T>(() => this.axiosInstance.put<T>(url, data, config));
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return await ApiService.makeRequest<T>(() => this.axiosInstance.post<T>(url, data, config));
  }

  public async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return await ApiService.makeRequest<T>(() => this.axiosInstance.patch<T>(url, data, config));
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return await ApiService.makeRequest<T>(() => this.axiosInstance.delete<T>(url, config));
  }

  public addRequestInterceptor(interceptor: AxiosRequestInterceptor): void {
    this.axiosInstance.interceptors.request.use(
      (value: AxiosRequestConfig) => interceptor.onFulfilled(value),
      (error: AxiosError) => interceptor.onRejected(error)
    );
  }

  public addResponseInterceptor(interceptor: AxiosResponseInterceptor): void {
    this.axiosInstance.interceptors.response.use(
      (value: AxiosResponse) => interceptor.onFulfilled(value),
      (error: AxiosError) => interceptor.onRejected(error)
    );
  }
}
