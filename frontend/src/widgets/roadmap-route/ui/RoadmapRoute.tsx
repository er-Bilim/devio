import { StationCard, type Roadmap } from '@/entities/roadmap';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

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
          className="spine absolute left-2.5 lg:left-1/2 -top-2.5 -bottom-2.5 w-0.75 -translate-x-1/2 bg-line opacity-[0.6] rounded-lg"
          aria-hidden="true"
        />

        <ol className="flex flex-col gap-5.5 lg:gap-11.5">
          {roadmap.stages.map((stage) => (
            <StationCard key={stage.id} stage={stage} roadmap={roadmap} />
          ))}
        </ol>
      </div>

      <div className="relative z-10 mt-13.5 mx-auto max-w-130 text-center p-7 border border-dashed border-line rounded-xl bg-panel/30">
        <p className="text-mist-soft mb-4">
          Конечная – твоё портфолио. Дальше – собеседования
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.25 py-3.25 px-7 rounded-lg font-bold text-[15px] bg-accent text-night duration-300 hover:brightness-[1.12]"
        >
          Начать с первой станции
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={3}
            className="size-2.5 text-night"
          />
        </Link>
      </div>
    </section>
  );
}
