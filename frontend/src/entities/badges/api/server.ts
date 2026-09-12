import { serverFetchPublic } from '@/shared/api/server';
import type { Badge } from '../model/types';

export const getBadges = () =>
  serverFetchPublic<Badge[]>('/badges', { tags: ['badges'] });
