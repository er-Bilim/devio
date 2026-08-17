import type { Roadmap, Stage } from '../model/types';
import { configHubRoadmap } from '@/widgets/directions-map';

interface StationChipProps {
  roadmap: Roadmap;
  stage: Stage;
  config: (typeof configHubRoadmap)[Roadmap['slug']];
  position: number;
}

export function StationChip({
  roadmap,
  stage,
  config,
  position,
}: StationChipProps) {
  return (
    <>
      <div
        key={stage.id}
        className={`absolute -translate-y-1/2 -translate-x-1/2 z-10 animate-drift line-${roadmap.slug}`}
        style={
          {
            left: `${config.stops[position]?.x}%`,
            top: `${config.stops[position]?.y}%`,
            '--accent': config.hub.color,
            '--dur': `${config.stops[position]?.dur}s`,
            '--delay': `${config.stops[position]?.delay}s`,
          } as React.CSSProperties
        }
      >
        <div className="stop inline-block py-2 px-3.75 rounded-xl whitespace-nowrap bg-[rgba(18,26,46,0.9)] border border-line backdrop-blur-4 font-mono text-[11.5px] text-accent shadow-[0_10px_26px_-18px_var(--accent)] ">
          <div className="inline-flex gap-3 items-center">
            <span className="text-accent text-[10px]">{stage.position}</span>
            <span className="text-mist">{stage.title}</span>
          </div>
        </div>
      </div>
    </>
  );
}
