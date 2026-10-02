import type { Stop } from '../model/steps';

interface HowStopProps {
  stop: Stop;
}

export function HowStop({ stop }: HowStopProps) {
  return (
    <div className="relative text-center px-3">
      <span
        className={`relative grid place-items-center w-14.5 h-14.5 mx-auto rounded-full bg-bg border-3 font-display font-medium text-[18px] ${stop.color.border}`}
      >
        {stop.numeric}
      </span>
      <h3 className="font-display font-medium text-[19px] tracking-[-.3px] mt-5.5">
        {stop.title}
      </h3>
      <p className="text-muted text-[15px] mt-2.5 max-w-[30ch] ml-auto mr-auto">
        {stop.description}
      </p>
    </div>
  );
}
