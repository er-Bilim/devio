import type { Score } from '@zxcvbn-ts/core';
import { cn } from '../lib/utils';

interface StrengthMeterProps {
  strength: Score;
}

export function StrengthMeter({ strength }: StrengthMeterProps) {
  return (
    <div className="grid grid-cols-4 gap-1.25 mt-2.25">
      {Array.from({ length: 4 }, (_, i) => {
        const colored = strength > i ? 'bg-rose' : 'bg-text/10';
        return (
          <div
            key={i}
            className={cn('h-1 rounded-full transition duration-300', colored)}
          />
        );
      })}
    </div>
  );
}
