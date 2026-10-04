import type { components } from '@/shared/api/api';

export type Direction = components['schemas']['DirectionStat'];

export interface DirectionConfig {
  color: {
    bg: string;
  };
}

export type DirectionPopularity = {
  slug: string;
  title: string;
  share: number;
  config: DirectionConfig;
};
