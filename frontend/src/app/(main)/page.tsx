import { DirectionsSection } from '@/src/widgets/directions-section';
import { HowSection } from '@/src/widgets/how-section';
import { HomeFaq } from '@/widgets/home-faq';
import { HomeHero } from '@/widgets/home-hero';
import { StatsSection } from '@/widgets/stats-section';
import { TicketCta } from '@/widgets/ticket-cta';

export default function Home() {
  return (
    <>
      <div className="aura" />
      <HomeHero />
      <DirectionsSection />
      <HowSection />
      <StatsSection />
      <HomeFaq />
      <TicketCta />
    </>
  );
}
