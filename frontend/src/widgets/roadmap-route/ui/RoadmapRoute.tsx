import { StationCard, type Roadmap } from '@/entities/roadmap';

interface RoadmapRouteProps {
  roadmap: Roadmap;
}

export function RoadmapRoute({ roadmap }: RoadmapRouteProps) {
  return (
    <section
      className="route z-10 pt-14 pb-7.5"
      style={{ '--accent': 'var(--mint)' } as React.CSSProperties}
    >
      <h2 className="font-display font-semibold text-[19px] mb-9.5 text-mist">
        Маршрут
      </h2>

      <div className="relative">
        <div
          className="spine absolute left-1/2 -top-2.5 -bottom-2.5 w-0.75 -translate-x-1/2 bg-line opacity-[0.6] rounded-lg"
          aria-hidden="true"
        />

        <ol className="flex flex-col gap-11.5">
          {roadmap.stages.map((stage) => (
            <StationCard key={stage.id} stage={stage} />
          ))}
        </ol>
      </div>
    </section>
  );
}
