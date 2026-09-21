import { getBadges, getCompletedBadges } from '@/entities/badges/api/server';
import { BadgesHero } from '@/widgets/badges-hero';
import { BadgesSection } from '@/widgets/badges-section/ui/BadgesSection';

export default async function BadgesPage() {
  const badges = await getBadges();
  const completedBadges = await getCompletedBadges();

  if (!badges) return null;

  return (
    <div className="wrap">
      <div className="aura-v2" />
      <BadgesHero badges={badges} completedBadges={completedBadges} />
      <BadgesSection badges={badges} />
    </div>
  );
}
