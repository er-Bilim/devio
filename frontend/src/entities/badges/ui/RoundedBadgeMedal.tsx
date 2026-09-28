import type { UserBadge } from '../model/types';
import { BadgeMedal } from './BadgeMedal';
import { tierClasses } from '../model/tier';

interface RoundedBadgeProps {
  badge: UserBadge;
}

export function RoundedBadge({ badge }: RoundedBadgeProps) {
  const medal = badge.badge;
  const isEarned = badge.earned_at ? true : false;

  return (
    <div
      className={`flex flex-col items-center text-center gap-1.25 ${tierClasses[medal.tier]}`}
    >
      <p className="tier font-mono text-[8.5px] tracking-[.14em] uppercase text-mist mt-2 mb-3">
        {medal.tier}
      </p>
      <BadgeMedal medal={medal} />
      <div className="text-[12px] font-semibold tracking-[1.3] text-mist">
        <p className="name mt-2 mb-1">{medal.title}</p>
        {isEarned && (
          <p className="sub font-mono text-[9.5px] text-mist-soft">пройдено</p>
        )}
      </div>
    </div>
  );
}
