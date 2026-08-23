import type { Roadmap } from '@/entities/roadmap';
import { buildThread } from '../model/buildThread';
import type { HubConfig } from '../model/layout';


export interface MapThreadsProps {
  roadmap: Roadmap;
  config: HubConfig;
  position: number;
}

export function MapThreads({ roadmap, config, position }: MapThreadsProps) {
  const hub = config.hub;
  if (!hub) return null;

  const stop = config.stops?.[position];
  if (!hub || !stop) return null;

  const params = {
    hub: { x: hub.x, y: hub.y },
    stop: { x: stop?.x, y: stop?.y },
    i: position,
  };

  const d = buildThread(params);
  if (!d) return null;

  return (
    <>
      <path className={`thread-base line-${roadmap.slug}`} d={d} />
      <path className={`thread flow line-${roadmap.slug}`} d={d} />
    </>
  );
}
