import { api } from '../lib/api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/login-check', credentials);
    return response.data;
  },

  async register(data: RegisterCredentials): Promise<void> {
    await api.post('/register', data);
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/profile');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/token/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};