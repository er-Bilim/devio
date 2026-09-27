import type { components } from '@/shared/api/api';

export type UserBadge = components['schemas']['UserBadgeOut'];
export type Badge = components['schemas']['BadgeOut'];
export type UserBadgesCompleted = components['schemas']['UserBadgesCompleted'];
export type BadgeWithEarned = Badge & {
  earned: boolean;
};

export const TIERS = ['common', 'rare', 'epic', 'legend', 'mythic'] as const;
export type Tier = (typeof TIERS)[number];
export type TierFilter = Tier | 'all';

export const STATUSES = ['earned', 'unearned'] as const;
export type Status = (typeof STATUSES)[number];
export type StatusFilter = Status | 'all';
