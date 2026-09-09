import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { env } from '../config/env';

// extendemos la interfaz de InternalAxiosRequestConfig para agregar el _retry
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: ConstrainBooleanOrDOMString;
  }
}

// configuracion base
const API_BASE_URL = env.apiBaseUrl;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// interceptor para agregar el token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// inteceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // realizamos la logica del refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

        const { token } = response.data;
        localStorage.setItem('access_token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);


        /* si no hay un refresh token, redirigimos al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
        return Promise.reject(error);*/
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;