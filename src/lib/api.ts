import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const authEndpoints = ['/login-check', '/api/register', '/token/refresh'];
    if (authEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      config.headers['X-API-TOKEN'] = import.meta.env.VITE_API_KEY;
    } else {
      // Add Bearer token for all other endpoints
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = useAuthStore.getState();
      const refreshToken = state.refreshToken;

      // If no refresh token, logout and redirect
      if (!refreshToken) {
        state.logout();
        window.location.href = '/login?session=expired';
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/token/refresh', {
          refresh_token: refreshToken,
        });
        console.log(response);
        const { token, refresh_token, token_expiration, user } = response.data;
        state.setTokens(token, refresh_token, token_expiration, user);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        state.logout();
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api };