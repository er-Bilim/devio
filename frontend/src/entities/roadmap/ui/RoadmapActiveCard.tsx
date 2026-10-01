import Link from 'next/link';
import { type Roadmap } from '../model/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight03Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { RouteLine } from './RouteLine';
import { pluralize } from '@/shared/lib/format';
import { DEFAULT_ICON, ROADMAP_CONFIG } from '../config/appearance';

interface RoadmapActiveCardProps {
  roadmap: Roadmap;
}

export function RoadmapActiveCard({ roadmap }: RoadmapActiveCardProps) {
  const Icon = ROADMAP_CONFIG[roadmap.icon] ?? DEFAULT_ICON;

  return (
    <Link
      href={`/roadmaps/${roadmap.slug}`}
      className="group relative flex flex-col p-7.5 rounded-(--r-lg) overflow-hidden bg-surface inset-ring inset-ring-line transition-all duration-300 ease-out hover:-translate-y-1 hover:inset-ring hover:shadow-[inset_0_0_0_1px_var(--line-2),0_30px_60px_-34px_rgba(0,0,0,0.9)]"
    >
      <span className="absolute inset-0 pointer-events-none opacity-90 bg-[radial-gradient(420px_220px_at_100%_0%,rgba(224,138,126,0.16),transparent_70%)]" />
      <div className="flex items-center justify-between gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-[16px] bg-rose/14">
          <HugeiconsIcon
            icon={Icon}
            strokeWidth={1.8}
            className="size-4 ic text-rose"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[13px] text-muted bg-text/5">
          <HugeiconsIcon
            icon={UserGroupIcon}
            strokeWidth={1.8}
            className="size-4 text-muted"
          />
          <span>64% выбирают</span>
        </div>
      </div>
      <h3 className="font-display font-medium text-[26px] tracking-[-.6px] mt-4.5">
        {roadmap.title}
      </h3>
      <p className="text-muted mt-2.5 max-w-[42ch]">{roadmap.description}</p>
      <RouteLine routes={roadmap.stages} />
      <div className="flex items-center justify-between gap-4 mt-auto pt-6.5">
        <div className="flex gap-4.5 text-[14px] text-muted">
          <span>
            <b className="text-text font-semibold mr-1">
              {roadmap.stages.length}
            </b>
            {pluralize(roadmap.stages.length, 'станция', 'станции', 'станций')}
          </span>
        </div>
        <div className="grid place-items-center w-11.5 h-11.5 rounded-full bg-surface-3 group-hover:bg-rose">
          <HugeiconsIcon
            icon={ArrowUpRight03Icon}
            strokeWidth={1.8}
            className="size-4 ic text-muted group-hover:text-surface duration-150 ease-in-out"
          />
        </div>
      </div>
    </Link>
  );
}
