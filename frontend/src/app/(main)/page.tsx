import { DirectionsSection } from '@/src/widgets/directions-section';
import { HowSection } from '@/src/widgets/how-section';
import { StripSection } from '@/src/widgets/strip-section';
import { HomeHero } from '@/widgets/home-hero';

export default function Home() {
  return (
    <>
      <div className="aura" />
      <HomeHero />
      <StripSection />
      <DirectionsSection />
      <HowSection />
    </>
  );
}
