import { create } from 'zustand';
import { api } from '@/shared/api';
import type { components } from '@/src/shared/types/api';

type User = components['schemas']['UserPublic'];

type AuthState = {
  user: User | null;
  status: 'loading' | 'authed' | 'guest';
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  status: 'loading',

  init: async () => {
    try {
      const user = await api<User>('/users/me');
      set({ user, status: 'authed' });
    } catch {
      set({ user: null, status: 'guest' });
    }
  },

  login: async (email, password) => {
    const user = await api<User>('/auth/login', {
      method: 'POST',
      data: JSON.stringify({ email, password }),
    });
    set({ user, status: 'authed' });
  },

  logout: async () => {
    await api('/auth/logout', { method: 'POST' });
    set({ user: null, status: 'guest' });
  },
}));
