import { serverFetchPublic } from '@/shared/api/server';
import type { Direction } from '../model/types';

export const getDirectionStats = () =>
  serverFetchPublic<Direction[]>('/stats/directions', { tags: ['directions'] });
