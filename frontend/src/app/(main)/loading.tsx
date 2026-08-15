import { DirectionsSectionSkeleton } from '@/widgets/directions-section';
import { HeroSectionSkeleton } from '@/widgets/hero-section';
import { HowSectionSkeleton } from '@/widgets/how-section';
import { StripSectionSkeleton } from '@/widgets/strip-section';

export default function Loading() {
  return (
    <>
      <HeroSectionSkeleton />
      <StripSectionSkeleton />
      <DirectionsSectionSkeleton />
      <HowSectionSkeleton />
    </>
  );
}
