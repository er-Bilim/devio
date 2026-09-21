import { cn } from '@/shared/lib/utils';
import { tierClasses } from '../model/tier';
import type { Badge } from '../model/types';
import { BadgeMedal } from './BadgeMedal';

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div
      className={cn(
        `relative flex gap-5 items-start pt-6.5 pb-6 px-6.5 rounded-[20px] bg-panel-2 border border-line`,
        tierClasses[badge.tier],
      )}
    >
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
