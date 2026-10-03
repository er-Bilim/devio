import { PieChart02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import './StatsCard.css';
import type { DirectionConfig } from '../lib/toShares';

type Popularity = {
  slug: string;
  title: string;
  share: number;
  config: DirectionConfig;
};

interface PopularityCardProps {
  active_directions: Popularity[];
}

export const PopularityCard = ({ active_directions }: PopularityCardProps) => {
  return (
    <div className="card">
      <h3>
        <HugeiconsIcon
          icon={PieChart02Icon}
          strokeWidth={2}
          className="ic text-faint"
        />
        Популярность направлений
      </h3>
      <div className="flex h-3.5 rounded-full overflow-hidden mt-7.5 gap-1">
        {active_directions.map((direction) => (
          <i
            key={direction.slug}
            style={{
              width: `${direction.share}%`,
            }}
            className={`block rounded-full ${direction.config.color.bg}`}
          />
        ))}
      </div>
      <div className="flex mt-4.5 gap-y-4 gap-x-11 flex-wrap">
        {active_directions.map((direction) => (
          <div key={direction.slug} className="flex items-baseline gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-[3px] self-center ${direction.config.color.bg}`} />
            <b className="font-display font-medium text-[28px] tracking-[-.6px]">
              {direction.share}%
            </b>
            <span className="text-[14px] text-muted">{direction.title}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4.5 border-t border-line text-[13.5px] text-faint">
        Доля пользователей, начавших направление за последние 30 дней
      </div>
    </div>
  );
};
