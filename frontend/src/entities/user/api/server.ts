import { serverFetchPublic } from '@/shared/api/server';
import type { UserProfile } from '../model/types';

export const getProfile = (username: string) =>
  serverFetchPublic<UserProfile>(`/users/${username}`, { tags: ['profile'] });
