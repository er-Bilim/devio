import { HugeiconsIcon } from '@hugeicons/react';
import type { Roadmap } from '../model/types';
import { PackageIcon } from '@hugeicons/core-free-icons';

interface RoadmapSoonCardProps {
  roadmap: Roadmap;
}

export function RoadmapSoonCard({ roadmap }: RoadmapSoonCardProps) {
  return (
    <div className="flex items-center gap-4.5 py-5.5 px-6.5 rounded-(--r-md) bg-transparent inset-ring inset-ring-line text-muted">
      <div className="w-10.5 h-10.5 rounded-[14px] bg-text/5 flex items-center justify-center">
        <HugeiconsIcon
          icon={PackageIcon}
          strokeWidth={1.8}
          className="size-4 ic text-faint"
        />
      </div>

      <span>
        <b className="block text-text font-semibold">{roadmap.title}</b>
        <small className="text-[13.5px]">Docker, CI/CD, мониторинг</small>
      </span>
      <span className="ml-auto text-[12.5px] py-1.25 px-2.75 rounded-full bg-text/5">
        строится
      </span>
    </div>
  );
}
