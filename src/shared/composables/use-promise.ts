import { useState } from "react";
import ServerError from "../services/http-client/server-error";
import { ErrorResponse } from "../models/error-response";

export interface PromiseInfo<T, S> {
  results: T | null;
  loading: boolean;
  error: ServerError<S> | null;
  create: (...args: Array<any>) => Promise<void>;
}

export default function usePromise<T, S = ErrorResponse>(
  fn: (...args: Array<any>) => Promise<T>
): PromiseInfo<T | null, S> {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const create = async (...args: Array<any>): Promise<void> => {
    try {
      setLoading(true);
      setResults(await fn(...args));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, create };
}
