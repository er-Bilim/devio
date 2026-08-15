import { DirectionsSection } from '@/src/widgets/directions-section';
import { HeroSection } from '@/src/widgets/hero-section';
import { HowSection } from '@/src/widgets/how-section';
import { StripSection } from '@/src/widgets/strip-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StripSection />
      <DirectionsSection />
      <HowSection />
    </>
  );
}
