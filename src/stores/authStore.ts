import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiration: number | null;
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (token: string, refreshToken: string, tokenExpiration: number, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      tokenExpiration: null,
      user: null,
      isAuthenticated: false,
      setTokens: (token, refreshToken, tokenExpiration, user) =>
        set({ token, refreshToken, tokenExpiration, user, isAuthenticated: true }),
      logout: () => {
        // Clear all auth-related state
        set({
          token: null,
          refreshToken: null,
          tokenExpiration: null,
          user: null,
          isAuthenticated: false,
        });
        // Clear persisted data
        localStorage.removeItem('auth-storage');
        // Clear any cached API responses
        localStorage.removeItem('api-cache');
        // Optionally clear session storage as well
        sessionStorage.clear();
      },
      checkAuth: () => {
        const state = get();
        if (!state.token || !state.tokenExpiration) {
          state.logout(); // Clear all auth data if token is missing
          return false;
        }
        // Check if token is expired (with 1 minute buffer)
        const isExpired = Date.now() >= (state.tokenExpiration * 1000) - 60000;
        if (isExpired) {
          state.logout(); // Clear all auth data if token is expired
          return false;
        }
        return true;
      },
    }),
    {
      name: 'auth-storage',
      // Only persist necessary fields
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiration: state.tokenExpiration,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);