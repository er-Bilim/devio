import 'server-only';
import type { UserPublic } from '../model/types';
import { serverFetch } from '@/shared/api/server';

export const getMe = () =>
  serverFetch<UserPublic>('/users/me', { cache: 'no-store' });
