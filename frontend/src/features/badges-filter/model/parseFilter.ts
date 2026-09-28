import {
  STATUSES,
  TIERS,
  type Status,
  type StatusFilter,
  type Tier,
  type TierFilter,
} from '@/entities/badges/model/types';

const isValidFilter = <T extends string | null>(
  value: string | null,
  values: readonly string[],
): value is T => value !== null && values.includes(value);

export const parseTier = (value: string | null): TierFilter =>
  isValidFilter<Tier>(value, TIERS) ? value : 'all';

export const parseStatus = (value: string | null): StatusFilter =>
  isValidFilter<Status>(value, STATUSES) ? value : 'all';
