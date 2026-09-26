import type { components } from '@/shared/api/api';

export type UserBadge = components['schemas']['UserBadgeOut'];
export type Badge = components['schemas']['BadgeOut'];
export type UserBadgesCompleted = components['schemas']['UserBadgesCompleted'];
export type BadgeWithEarned = Badge & {
  earned: boolean;
};
