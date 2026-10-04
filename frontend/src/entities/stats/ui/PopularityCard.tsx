import { PieChart02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import './StatsCard.css';
import { ActivePopularityCard } from './ActivePopularityCard';
import { SoonPopularityCard } from './SoonPopularityCard';
import { toShares } from '../lib/toShares';
import type { Direction } from '../model/types';

interface PopularityCardProps {
  popular_directions: Direction[];
}

export const PopularityCard = ({ popular_directions }: PopularityCardProps) => {
  const directions = toShares(popular_directions);

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
      {directions.length > 0 ? (
        <ActivePopularityCard directions={directions} />
      ) : (
        <SoonPopularityCard directions={popular_directions} />
      )}
    </div>
  );
};
