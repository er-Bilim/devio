import { cn } from '@/shared/lib/utils';
import { tierClasses } from '../model/tier';
import type { BadgeWithEarned } from '../model/types';
import { BadgeMedal } from './BadgeMedal';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckIcon } from '@hugeicons/core-free-icons';

interface BadgeCardProps {
  badge: BadgeWithEarned;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const isEarned: boolean = badge.earned;

  return (
    <div
      className={cn(
        `relative flex gap-5 items-start pt-6.5 pb-6 px-6.5 rounded-[20px] bg-panel-2 border border-line duration-300`,
        tierClasses[badge.tier],
        {
          'opacity-50': !isEarned,
          'hover:border-mint/40 hover:bg-mint/5': isEarned,
        },
      )}
    >
      {isEarned && (
        <div className="absolute top-3 right-3 bg-mint/20 p-1 rounded-xl border border-mint/70">
          <HugeiconsIcon
            icon={CheckIcon}
            strokeWidth={2}
            className="size-3 text-mint"
          />
        </div>
      )}
      <BadgeMedal medal={badge} />
      <div className="min-w-0">
        <h3 className="font-display font-semibold text-[15px] leading-[1.3] tracking-[-.2px] text-mist">
          {badge.title}
        </h3>
        <p className="text-[13px] text-mist-soft mt-2 leading-[1.55] max-w-[30ch]">
          {badge.description}
        </p>
        <div className="flex items-center gap-2.5 mt-4 font-mono text-[10px] text-mist-soft">
          <span className="tier tracking-[.30em] uppercase font-medium">
            {badge.tier}
          </span>
        </div>
      </div>
    </div>
  );
}
