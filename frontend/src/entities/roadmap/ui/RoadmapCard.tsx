import { RoadmapStatus, type Roadmap } from '../model/types';
import { RoadmapSoonCard } from './RoadmapSoonCard';
import { RoadmapActiveCard } from './RoadmapActiveCard';
import type { DirectionPopularity } from '@/entities/stats';

interface RoadmapCardProps {
  roadmap: Roadmap;
  stats?: DirectionPopularity[];
}

export function RoadmapCard({ roadmap, stats }: RoadmapCardProps) {
  return roadmap.status === RoadmapStatus.DRAFT ? (
    <RoadmapSoonCard roadmap={roadmap} />
  ) : (
    <RoadmapActiveCard roadmap={roadmap} stats={stats} />
  );
}
