import { usePathname, useSearchParams } from 'next/navigation';
import type { StatusFilter, TierFilter } from '@/entities/badges/model/types';
import { parseTier, parseStatus } from './parseFilter';

type Params = { tier: TierFilter; status: StatusFilter };

export const useBadgeFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tier = parseTier(searchParams.get('tier'));
  const status = parseStatus(searchParams.get('status'));

  const setBadgeFilter = <K extends keyof Params>(key: K, next: Params[K]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next === 'all') {
      params.delete(key);
    } else {
      params.set(key, next);
    }

    const query = params.toString();

    window.history.replaceState(
      null,
      '',
      query ? `${pathname}?${query}` : pathname,
    );
  };

  return { tier, status, setBadgeFilter };
};
