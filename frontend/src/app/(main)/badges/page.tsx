import { getBadges, getCompletedBadges } from '@/entities/badges/api/server';
import { BadgesHero } from '@/widgets/badges-hero';
import { BadgesSection } from '@/widgets/badges-section/ui/BadgesSection';

export default async function BadgesPage() {
  const catalog = await getBadges();
  const completedBadges = await getCompletedBadges();

  if (!catalog || !completedBadges) return null;

  const earnedCodes = new Set(completedBadges.map((b) => b.code));
  const allBadges = catalog.map((b) => ({
    ...b,
    earned: earnedCodes.has(b.code),
  }));
  const sortedBadges = allBadges.toSorted(
    (a, b) => Number(b.earned) - Number(a.earned),
  );

  return (
    <div className="wrap">
      <div className="aura-v2" />
      <BadgesHero badges={catalog} completedBadges={completedBadges} />
      <BadgesSection badges={sortedBadges} />
    </div>
  );
}
