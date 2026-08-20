import type { components } from '@/shared/types/api';

export type Roadmap = components['schemas']['RoadmapOut'];
export type Stage = components['schemas']['StageOut'];

export type Station = { title: string; status: 'done' | 'here' | 'next' };

export const RoadmapStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
} as const;

export type RoadmapStatus = (typeof RoadmapStatus)[keyof typeof RoadmapStatus];
