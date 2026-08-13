import { serverFetch } from '@/shared/api/server';
import type { Roadmap } from '../model/types';

export const getRoadmap = (roadmap_id: number) =>
  serverFetch<Roadmap>(`/roadmaps/${roadmap_id}`);
export const getRoadmaps = () => serverFetch<Roadmap[]>('/roadmaps');
