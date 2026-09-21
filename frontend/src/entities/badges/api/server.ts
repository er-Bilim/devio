import { serverFetch, serverFetchPublic } from '@/shared/api/server';
import type { Badge, UserBadgesCompleted } from '../model/types';

export const getBadges = () =>
  serverFetchPublic<Badge[]>('/badges', { tags: ['badges'] });

export const getCompletedBadges = () =>
  serverFetch<UserBadgesCompleted[]>('/users/me/badges');
