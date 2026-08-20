import { RoadmapCard, RoadmapStatus, type Roadmap } from '@/entities/roadmap';
import { DirectionDepotHead } from './DirectionDepotHead';

interface DirectionsDepotProps {
  roadmaps: Roadmap[];
}

export function DirectionsDepot({ roadmaps }: DirectionsDepotProps) {
  const roadmapsDepot = roadmaps.filter(
    (roadmap) => roadmap.status === RoadmapStatus.DRAFT,
  );

  return (
    <section className="relative z-10 mt-15 pt-7.5 pb-2 border-t border-t-line mb-10">
      <DirectionDepotHead />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {roadmapsDepot.map((roadmap) => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))}
      </div>
    </section>
  );
}
