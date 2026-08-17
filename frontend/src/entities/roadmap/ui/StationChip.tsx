import type { Roadmap, Stage } from '../model/types';
import { configHubRoadmap } from '@/widgets/directions-map';

interface StationChipProps {
  roadmap: Roadmap;
}

export function StationChip({ roadmap }: StationChipProps) {
  const stages: Stage[] = roadmap.stages;

  return (
    <>
      {stages &&
        stages.map((stage) => (
          <div
            key={stage.id}
            className="absolute -translate-y-1/2 -translate-x-1/2 z-10 animate-drift"
            style={
              {
                left: `${configHubRoadmap[roadmap.slug]?.stops[stage.position - 1]?.x}%`,
                top: `${configHubRoadmap[roadmap.slug]?.stops[stage.position - 1]?.y}%`,
                '--accent': configHubRoadmap[roadmap.slug]?.hub.color,
                '--dur': `${configHubRoadmap[roadmap.slug]?.stops[stage.position - 1]?.dur}s`,
                '--delay': `${configHubRoadmap[roadmap.slug]?.stops[stage.position - 1]?.delay}s`,
              } as React.CSSProperties
            }
          >
          <div className="inline-block py-2 px-3.75 rounded-xl whitespace-nowrap bg-[rgba(18,26,46,0.9)] border border-line backdrop-blur-4 font-mono text-[11.5px] text-accent shadow-[0_10px_26px_-18px_var(--accent)] ">
              <div className="inline-flex gap-3 items-center">
                <span className="text-accent text-[10px]">
                  {stage.position}
                </span>
                <span>{stage.title}</span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
