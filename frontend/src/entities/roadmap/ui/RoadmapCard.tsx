import Link from 'next/link';
import { RoadmapStatus, type Roadmap } from '../model/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { TradeUpIcon } from '@hugeicons/core-free-icons';
import { RoadmapMiniLine } from './RoadmapMinLine';
import { pluralize } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const shell = 'relative bg-panel border border-line p-6.5 rounded-xl';

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return roadmap.status === RoadmapStatus.DRAFT ? (
    <DraftCard roadmap={roadmap} />
  ) : (
    <ActiveCard roadmap={roadmap} />
  );
}

function ActiveCard({ roadmap }: RoadmapCardProps) {
  return (
    <Link
      href={`/roadmaps/${roadmap.slug}`}
      className={cn(
        shell,
        'block duration-200 hover:border-signal hover:-translate-y-0.5',
      )}
    >
      <div className="flex items-center justify-between mb-4.5">
        <p className="font-display font-semibold text-[19px] text-mist">
          {roadmap.title}
        </p>
        <div className="flex items-center gap-1.5 font-mono text-[12px] text-mist-soft">
          <HugeiconsIcon
            icon={TradeUpIcon}
            strokeWidth={1.8}
            className="size-4 text-amber"
          />
          <span>64% выбирают</span>
        </div>
      </div>

      <div className="mt-1.5 mb-4">
        <RoadmapMiniLine total={roadmap.stages.length} filled={3} />
      </div>

      <p className="text-mist-soft text-[14.5px] mb-4.5">
        {roadmap.description}
      </p>

      <div className="flex gap-4.5 font-mono text-[12px] text-mist-soft">
        <p className="flex items-center gap-2">
          <i className="text-signal">{roadmap.stages.length}</i>
          {pluralize(roadmap.stages.length, 'станция', 'станции', 'станций')}
        </p>
        <p className="flex items-center gap-2">
          <i className="text-signal">~4</i> месяца
        </p>
      </div>
    </Link>
  );
}

function DraftCard({ roadmap }: RoadmapCardProps) {
  return (
    <article className={cn(shell, 'opacity-55')}>
      <span className="absolute top-5 right-5 font-mono text-[11px] text-amber border border-dashed border-amber rounded-xl py-0.75 px-2.5">
        скоро
      </span>
      <p className="font-display font-semibold text-[19px] text-mist mb-4.5">
        {roadmap.title}
      </p>
      <p className="text-mist-soft text-[14.5px]">{roadmap.description}</p>
    </article>
  );
}
