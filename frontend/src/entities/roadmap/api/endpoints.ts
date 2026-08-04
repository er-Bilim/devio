import { api } from '@/shared/api';
import type { Roadmap } from '../model/types';

export const getRoadmaps = () => api<Roadmap[]>('/roadmaps');
export const getRoadmap = (slug: string) => api<Roadmap>(`/roadmaps/${slug}`); 
