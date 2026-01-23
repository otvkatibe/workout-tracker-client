import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage, logError, NetworkError, AuthenticationError } from '../utils/errorHandler';


export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}, context = null) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      if (!navigator.onLine) {
        throw new NetworkError();
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || 'Erro na requisição');
        error.statusCode = response.status;
        error.data = data;

        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new AuthenticationError(data.message || 'Sessão expirada. Faça login novamente.');
        }

        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        err.message = 'Requisição demorou muito. Tente novamente.';
      }

      const errorMessage = getErrorMessage(err, context);
      setError(errorMessage);

      logError(err, { url, method: options.method, context });

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, options = {}, context = null) => {
    return request(url, { ...options, method: 'GET' }, context);
  }, [request]);

  const post = useCallback((url, body, options = {}, context = null) => {
    return request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }, context);
  }, [request]);

  const put = useCallback((url, body, options = {}, context = null) => {
    return request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }, context);
  }, [request]);

  const del = useCallback((url, options = {}, context = null) => {
    return request(url, { ...options, method: 'DELETE' }, context);
  }, [request]);

  return { request, get, post, put, del, loading, error };
}


export function useApiWithToast() {
  const api = useApi();

  const requestWithToast = useCallback(async (
    apiCall,
    successMessage = null,
    errorMessage = null
  ) => {
    try {
      const result = await apiCall();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      toast.error(errorMessage || err.message);
      throw err;
    }
  }, []);

  return { ...api, requestWithToast };
}
