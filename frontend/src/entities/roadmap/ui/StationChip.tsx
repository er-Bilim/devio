import type { Stage } from '../model/types';

interface StationChipProps {
  stages: Stage[] | null;
}

export function StationChip({ stages }: StationChipProps) {
  return (
    <>
      {stages &&
        stages.map((stage) => (
          <div
            key={stage.position}
            className="absolute -translate-y-1/2 -translate-x-1/2 z-10 animate-drift"
            style={{
              left: `${Math.sqrt(stage.position * stage.position * 10)}%`,
              top: `${Math.sqrt(stage.position * stage.position * 60)}%`,
            }}
          >
            <div className="inline-block py-2 px-3.75 rounded-xl whitespace-nowrap bg-[rgba(18,26,46,0.9)] border border-line backdrop-blur-4 font-mono text-[11.5px] text-mist shadow-[0_10px_26px_-18px_var(--accent)] ">
              <div className="inline-flex gap-3 items-center">
                <span className="text-mint text-[10px]">{stage.position}</span>
                <span>{stage.title}</span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
