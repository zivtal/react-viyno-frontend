/**
 * Contains common functionality for request interceptors that append
 * additional fields to request body or params.
 */
import { AxiosRequestConfig } from 'axios';

export const addFieldToRequest = (request: AxiosRequestConfig, key: string, value: string | number): AxiosRequestConfig => {
  const method = request.method?.toLowerCase();

  if (!value) {
    return request;
  }

  if (request.data instanceof FormData) {
    request.data.append(key, String(value));

    return request;
  }

  if (method === 'post' || method === 'put' || method === 'patch') {
    // Request with body - add field into body
    request.data = {
      ...(request.data || {}),
      [key]: value,
    };

    return request;
  }

  // Request without body - add field to params
  request.params = {
    ...(request.params || {}),
    [key]: String(value),
  };

  return request;
};
