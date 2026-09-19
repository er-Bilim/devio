import { serverFetchPublic } from '@/shared/api/server';
import type { Badge } from '../model/types';

export const getBadges = () =>
  serverFetchPublic<Badge[]>('/badges', { tags: ['badges'] });
export const getCompletedBadges = () =>
  serverFetchPublic<Badge[]>('/users/badges', {
    tags: ['users', 'badges', 'completed-badges'],
  });
