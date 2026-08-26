import { serverFetchPublic } from '@/shared/api/server';
import type { Roadmap } from '../model/types';

export const getRoadmap = (slug: string) =>
  serverFetchPublic<Roadmap>(`/roadmaps/${slug}`, { tags: ['roadmaps'] });
export const getRoadmaps = () =>
  serverFetchPublic<Roadmap[]>('/roadmaps', { tags: ['roadmaps'] });
