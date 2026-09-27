'use client';
import Link from 'next/link';
import { statusFilters, tierFilters } from '../model/filters';
import { useBadgeFilter } from '../model/useBadgesFilter';
import { cn } from '@/shared/lib/utils';

export function BadgesFilter() {
  const { setBadgeFilter, status, tier } = useBadgeFilter();
  const isActiveAll = status === 'all' && tier === 'all';
  const filterStyle =
    'font-mono text-[11.5px] py-2 px-4.75 rounded-xl text-mist-soft bg-none border border-line';
  const activeStyle = 'text-night bg-mint border-mint font-bold';

  return (
    <ul className="flex items-center gap-2 flex-wrap mb-6.5">
      <li>
        <Link
          href="/badges"
          className={cn(filterStyle, isActiveAll && activeStyle)}
        >
          все
        </Link>
      </li>
      {statusFilters.map((filter) => {
        const isActive = filter.value === status;
        return (
          <li key={filter.value}>
            <button
              className={cn(filterStyle, isActive && activeStyle, {})}
              onClick={() => setBadgeFilter('status', filter.value)}
            >
              {filter.label}
            </button>
          </li>
        );
      })}

      <div className="w-px h-6 bg-line mx-2" />

      {tierFilters.map((filter) => {
        const isActive = filter.value === tier;
        const isMythicValue = filter.value === 'mythic';
        const isMythicValueActive: boolean = tier === 'mythic' && isMythicValue;
        return (
          <li key={filter.value}>
            <button
              className={cn(filterStyle, isActive && activeStyle, {
                'border-myth text-myth': isMythicValue,
                'border-myth-void text-myth-void bg-myth': isMythicValueActive,
              })}
              onClick={() => setBadgeFilter('tier', filter.value)}
            >
              {filter.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
