import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const buildServerBaseUrl = (apiBaseUrl) => {
  if (!apiBaseUrl) return '';
  if (apiBaseUrl.startsWith('/')) return '';
  return apiBaseUrl.replace(/\/api\/?$/, '');
};

export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL || buildServerBaseUrl(API_BASE_URL);

export const resolveAssetUrl = (assetPath = '') => {
  if (!assetPath) return '';
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  if (!SERVER_BASE_URL) {
    return `/${normalizedPath}`;
  }

  return `${SERVER_BASE_URL}/${normalizedPath}`;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;