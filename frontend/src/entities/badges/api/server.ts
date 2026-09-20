import { serverFetchPublic } from '@/shared/api/server';
import type { Badge, UserBadgesCompleted } from '../model/types';

export const getBadges = () =>
  serverFetchPublic<Badge[]>('/badges', { tags: ['badges'] });

export const getCompletedBadges = () =>
  serverFetchPublic<UserBadgesCompleted[]>('/users/me/badges', {
    tags: ['badges', 'completed-badges'],
  });
