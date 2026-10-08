import { getRoadmaps } from '@/entities/roadmap/api/server';
import { DirectionHeader } from '@/widgets/direction-header';

export default async function Roadmaps() {
  const roadmaps = await getRoadmaps();

  if (!roadmaps) return null;

  return (
    <>
      <DirectionHeader />
    </>
  );
}
