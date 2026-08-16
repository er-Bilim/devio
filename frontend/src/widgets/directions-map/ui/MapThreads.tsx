import type { Roadmap } from '@/entities/roadmap';
import { configHubRoadmap } from '@/entities/roadmap';

export interface MapThreadsProps {
  roadmap: Roadmap;
}

export function MapThreads({ roadmap }: MapThreadsProps) {
  const stages = roadmap.stages;
  
  return (
    <svg
      className="absolute"
      viewBox="0 0 1160 770"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {stages.map((stage) => {
        const style =
          stage.position % 2 === 0
            ? 'fill-none stroke-2.5 [stroke-linecap:round] opacity-90'
            : 'fill-none stroke-line stroke-2 opacity-50';
        return (
          <path
            className={style}
            d={configHubRoadmap[roadmap.slug]?.threads[stage.position - 1]}
          />
        );
      })}
    </svg>
  );
}
