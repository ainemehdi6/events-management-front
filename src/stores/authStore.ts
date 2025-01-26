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
  setUser: (user: User) => void;
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
      setUser: (user) => set({ user }),
      logout: () => {
        set({
          token: null,
          refreshToken: null,
          tokenExpiration: null,
          user: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('api-cache');
        sessionStorage.clear();
      },
      checkAuth: () => {
        const state = get();
        if (!state.token || !state.tokenExpiration) {
          state.logout();
          return false;
        }
        const isExpired = Date.now() >= (state.tokenExpiration * 1000) - 60000;
        if (isExpired) {
          state.logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'auth-storage',
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
