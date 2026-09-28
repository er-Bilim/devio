'use client';

import { BadgeCard, type BadgeWithEarned } from '@/entities/badges';
import { BadgesFilter, useBadgeFilter } from '@/features/badges-filter';

interface BadgesSectionProps {
  badges: BadgeWithEarned[];
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  const { tier, status } = useBadgeFilter();
  const isEarned = status === 'earned';

  const filteredBadges = badges
    .filter((badge) => (tier === 'all' ? badge : badge.tier === tier))
    .filter((badge) => (status === 'all' ? badge : badge.earned === isEarned));

  return (
    <section>
      <BadgesFilter />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-5.5">
        {filteredBadges.map((badge) => {
          return <BadgeCard key={badge.code} badge={badge} />;
        })}
      </div>
      <div className="rule" />
      <div className="pt-20 pb-25 text-center text-mist-soft text-[14px]">
        <p>Новые жетоны появляются вместе с новыми направлениями</p>
      </div>
    </section>
  );
}
