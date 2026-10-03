import { DirectionsSection } from '@/src/widgets/directions-section';
import { HowSection } from '@/src/widgets/how-section';
import { HomeHero } from '@/widgets/home-hero';
import { StatsSection } from '@/widgets/stats-section';

export default function Home() {
  return (
    <>
      <div className="aura" />
      <HomeHero />
      <DirectionsSection />
      <HowSection />
      <StatsSection />
    </>
  );
}
