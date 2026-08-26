import { create } from 'zustand';
import { api } from '@/shared/api';
import type { components } from '@/src/shared/types/api';

type User = components['schemas']['UserPublic'];

type AuthState = {
  user: User | null;
  status: 'idle' | 'loading' | 'authed' | 'guest';
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',

  init: async () => {
    try {
      if (get().status !== 'idle') return;
      set({ status: 'loading' });
      const { data: user } = await api.get<User>('/users/me');

      set({ user, status: 'authed' });
    } catch {
      set({ user: null, status: 'guest' });
    }
  },

  login: async (email, password) => {
    const { data: user } = await api.post<User>('/auth/login', {
      email,
      password,
    });
    set({ user, status: 'authed' });
  },

  register: async (email, password) => {
    const { data: user } = await api.post<User>('/auth/register', {
      email,
      password,
    });
    set({ user, status: 'authed' });
  },

  logout: async () => {
    await api('/auth/logout', { method: 'POST' });
    set({ user: null, status: 'guest' });
  },
}));
