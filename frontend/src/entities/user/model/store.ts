import { create } from 'zustand';
import { api } from '@/shared/api';
import type { UserPrivate } from './types';

type AuthState = {
  user: UserPrivate | null;
  status: 'idle' | 'loading' | 'authed' | 'guest';
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    display_name: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',

  init: async () => {
    try {
      if (get().status !== 'idle') return;
      set({ status: 'loading' });
      const { data: user } = await api.get<UserPrivate>('/users/me');

      set({ user, status: 'authed' });
    } catch {
      set({ user: null, status: 'guest' });
    }
  },

  login: async (email, password) => {
    const { data: user } = await api.post<UserPrivate>('/auth/login', {
      email,
      password,
    });
    set({ user, status: 'authed' });
  },

  register: async (email, username, display_name, password) => {
    const { data: user } = await api.post<UserPrivate>('/auth/register', {
      email,
      username,
      display_name,
      password,
    });
    set({ user, status: 'authed' });
  },

  logout: async () => {
    await api('/auth/logout', { method: 'POST' });
    set({ user: null, status: 'guest' });
  },
}));
