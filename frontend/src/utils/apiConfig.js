/**
 * API Configuration Utility
 * Reads VITE_API_BASE_URL from frontend/.env
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

/**
 * Returns full API URL for a given relative endpoint or path.
 * e.g. getApiUrl('/api/applications') => 'http://localhost:5000/api/applications'
 */
export function getApiUrl(path) {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}
