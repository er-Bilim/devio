import { DirectionsSectionSkeleton } from '@/widgets/directions-section';
import { HowSectionSkeleton } from '@/widgets/how-section';

export default function Loading() {
  return (
    <>
      {/*Здесь будет HomeHeroSkeleton*/}
      <DirectionsSectionSkeleton />
      <HowSectionSkeleton />
    </>
  );
}
