import { BadgeCard, type BadgeWithEarned } from '@/entities/badges';

interface BadgesSectionProps {
  badges: BadgeWithEarned[];
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <section>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-5.5">
        {badges.map((badge) => {
          return <BadgeCard key={badge.code} badge={badge} />;
        })}
      </div>
      <div className="rule" />
    </section>
  );
}
