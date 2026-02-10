import { useState, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';
import { ApiService, ApiError } from '../services/api.service';
import logger from '../utils/logger';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (config: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T = any>(): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (config: AxiosRequestConfig): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });

    try {
      let response: T;
      
      switch (config.method?.toUpperCase()) {
        case 'POST':
          response = await ApiService.post<T>(config.url || '', config.data, config);
          break;
        case 'PUT':
          response = await ApiService.put<T>(config.url || '', config.data, config);
          break;
        case 'DELETE':
          response = await ApiService.delete<T>(config.url || '', config);
          break;
        default:
          response = await ApiService.get<T>(config.url || '', config);
      }

      setState({ data: response, loading: false, error: null });
      return response;
    } catch (err) {
      const error = err as ApiError;
      setState({ data: null, loading: false, error: error.message });
      logger.error('API call failed', error);
      return null;
    }
  }, []);

  const reset = useCallback((): void => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

export default useApi;
