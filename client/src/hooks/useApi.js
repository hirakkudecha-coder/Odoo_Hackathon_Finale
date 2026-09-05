import { useState, useEffect, useCallback } from 'react';

/**
 * Universal authenticated fetch utility
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errorMsg;
    } catch {
      // Non-JSON error
    }
    const err = new Error(errorMsg);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

/**
 * Custom React hook for fetching API data with automatic fallback
 * @param {string} endpoint - API route (e.g. '/api/contacts')
 * @param {*} fallbackData - Initial and error fallback data
 * @param {Object} options - Options including query params or transform function
 */
export function useApi(endpoint, fallbackData = null, options = {}) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const json = await apiRequest(endpoint, options);
      if (options.transform) {
        setData(options.transform(json));
      } else {
        setData(json);
      }
    } catch (err) {
      console.warn(`[useApi] Request failed for ${endpoint}:`, err.message);
      setError(err);
      if (fallbackData !== undefined) {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useApi;
