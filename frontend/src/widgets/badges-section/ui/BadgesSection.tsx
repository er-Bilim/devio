import {
  BadgeCard,
  type Badge,
} from '@/entities/badges';

interface BadgesSectionProps {
  badges: Badge[];
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <section>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-5.5">
        {badges.map((badge) => {
          return <BadgeCard key={badge.code} badge={badge} />;
        })}
      </div>
    </section>
  );
}
