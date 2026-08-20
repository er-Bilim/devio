import { serverFetch } from '@/shared/api/server';
import type { Roadmap } from '../model/types';

export const getRoadmap = (slug: string) =>
  serverFetch<Roadmap>(`/roadmaps/${slug}`);
export const getRoadmaps = () => serverFetch<Roadmap[]>('/roadmaps');
