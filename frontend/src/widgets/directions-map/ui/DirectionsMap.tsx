import { RoadmapHubCard, StationChip, type Roadmap } from '@/entities/roadmap';

interface RoadmapsProps {
  roadmaps: Roadmap[] | null;
}

export function DirectionsMap({ roadmaps }: RoadmapsProps) {

  if (!roadmaps || roadmaps.length === 0) return null;
  
  return (
    <>
      <RoadmapHubCard roadmaps={roadmaps} />
      <StationChip stages={roadmaps[0]?.stages}/>
    </>
  );
}
