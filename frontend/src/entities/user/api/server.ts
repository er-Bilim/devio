import { serverFetchPublic } from '@/shared/api/server';
import type { UserPublic } from '../model/types';

export const getProfile = (username: string) =>
  serverFetchPublic<UserPublic>(`/users/${username}`, { tags: ['profile'] });
// export const get