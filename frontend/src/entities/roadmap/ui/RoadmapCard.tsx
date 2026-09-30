import { RoadmapStatus, type Roadmap } from '../model/types';
import { RoadmapSoonCard } from './RoadmapSoonCard';
import { RoadmapActiveCard } from './RoadmapActiveCard';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

// const shell = 'relative bg-panel border border-line p-6.5 rounded-xl';

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return roadmap.status === RoadmapStatus.DRAFT ? (
    <RoadmapSoonCard roadmap={roadmap} />
  ) : (
    <RoadmapActiveCard roadmap={roadmap} />
  );
}
