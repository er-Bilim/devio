import { RoundedBadge } from '@/entities/badges/ui/RoundedBadgeMedal';
import type { UserProfile } from '@/entities/user/model/types';
import { Award04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ProfileBadgesProps {
  profile: UserProfile;
  badgesCount: number;
}

export function ProfileBadges({ profile, badgesCount }: ProfileBadgesProps) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4 flex-wrap my-5.5">
        <div>
          <div className="sec-head flex flex-row gap-2 items-center">
            <HugeiconsIcon
              icon={Award04Icon}
              strokeWidth={2}
              className="size-4.5 text-mist-soft"
            />
            <h2>Жетоны</h2>
          </div>
          <div className="sec-sub mt-2">
            <div className="flex flex-row gap-2">
              <span className="text-mist font-semibold">
                {profile.badges.length} из {badgesCount}
              </span>
              <span className="inline-flex gap-1">редкие светятся</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-x-5 gap-y-3.5">
        {profile.badges.map((badge) => (
          <RoundedBadge key={badge.badge.code} badge={badge} />
        ))}
      </div>
      <div className="rule" />
    </section>
  );
}
