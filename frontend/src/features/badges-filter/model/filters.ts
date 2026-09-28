import type { StatusFilter, TierFilter } from '@/entities/badges/model/types';

type FilterOption<T> = { value: T; label: string };

export const tierFilters: FilterOption<TierFilter>[] = [
  {
    value: 'common',
    label: 'обычные',
  },
  {
    value: 'rare',
    label: 'редкие',
  },
  {
    value: 'epic',
    label: 'эпические',
  },
  {
    value: 'legend',
    label: 'легендарные',
  },
  {
    value: 'mythic',
    label: 'мифические',
  },
];

export const statusFilters: FilterOption<StatusFilter>[] = [
  {
    value: 'earned',
    label: 'собранные',
  },
  {
    value: 'unearned',
    label: 'не собранные',
  },
];
