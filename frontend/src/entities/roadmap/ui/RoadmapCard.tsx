import { RoadmapStatus, type Roadmap } from '../model/types';
import { RoadmapSoonCard } from './RoadmapSoonCard';
import { RoadmapActiveCard } from './RoadmapActiveCard';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return roadmap.status === RoadmapStatus.DRAFT ? (
    <RoadmapSoonCard roadmap={roadmap} />
  ) : (
    <RoadmapActiveCard roadmap={roadmap} />
  );
}
