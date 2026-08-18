import { RoadmapHeaderSkeleton } from '@/widgets/roadmap-header';
import { RoadmapRouteSkeleton } from '@/widgets/roadmap-route';

export default function Loading() {
  return (
    <div className="wrap">
      <RoadmapHeaderSkeleton />
      <RoadmapRouteSkeleton />
    </div>
  );
}
