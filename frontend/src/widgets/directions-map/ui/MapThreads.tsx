import type { Roadmap } from '@/entities/roadmap';
import { buildThread } from '../model/buildThread';
import { configHubRoadmap } from '../model/layout';

export interface MapThreadsProps {
  roadmap: Roadmap;
}

export function MapThreads({ roadmap }: MapThreadsProps) {
  const stages = roadmap.stages;
  const config = configHubRoadmap[roadmap.slug];
  if (!config) return null;
  const hub = config.hub;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1160 770"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {stages.map((stage, index) => {
        const stop = config.stops?.[index];
        if (!hub || !stop) return null;

        const params = {
          hub: { x: hub.x, y: hub.y },
          stop: { x: stop?.x, y: stop?.y },
          i: index,
        };

        const d = buildThread(params);
        if (!d) return null;

        return (
          <g
            key={stage.id}
            style={
              { '--thread-color': config.hub.color } as React.CSSProperties
            }
          >
            <path className="thread-base" d={d} />
            <path className="thread flow" d={d} />
            <circle cx={(hub.x/100)*1160} cy={(hub.y/100)*770} r="6" fill="red" />
          </g>
        );
      })}
    </svg>
  );
}
