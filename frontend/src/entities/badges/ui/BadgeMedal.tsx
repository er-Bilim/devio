import { HugeiconsIcon } from '@hugeicons/react';
import type { Badge } from '../model/types';
import { tierClasses } from '../model/tier';
import './badge-medal.css';
import { BADGE_ICONS, DEFAULT_ICON } from './badgeIcon';

interface BadgeMedalProps {
  medal: Badge;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeMedal({ medal, size = 'md' }: BadgeMedalProps) {
  const sizes = {
    sm: {
      size: 'size-10',
      ring: 'inset-0',
      disc: 'inset-1',
      icon: 'size-4',
    },
    md: {
      size: 'size-19',
      ring: 'inset-1',
      disc: 'inset-1.5',
      icon: 'size-6',
    },
    lg: {
      size: 'size-24',
      ring: 'inset-1.5',
      disc: 'inset-2',
      icon: 'size-8',
    },
  };

  const Icon = BADGE_ICONS[medal.icon] ?? DEFAULT_ICON;

  return (
    <>
      <div
        className={`flex flex-col items-center text-center gap-1.25 ${tierClasses[medal.tier]}`}
      >
        <div
          className={`medal relative ${sizes[size].size} grid place-items-center`}
        >
          <div className="ring absolute inset-0 rounded-full z-10" />
          <div
            className={`disc absolute ${sizes[size].disc} rounded-full bg-night grid place-items-center z-20 tier`}
          >
            <HugeiconsIcon
              icon={Icon}
              strokeWidth={2}
              className={`icon ${sizes[size].icon} z-30`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
