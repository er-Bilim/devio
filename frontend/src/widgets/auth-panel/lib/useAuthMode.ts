'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import type { AuthMode } from '../model/types';

export const useAuthMode = () => {
  const searchParams = useSearchParams();
  const authMode = (searchParams.get('mode') as AuthMode) ?? 'signin';
  const pathname = usePathname();

  const setAuthParams = (next: AuthMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', next);

    const query = params.toString();

    window.history.replaceState(null, '', `${pathname}?${query}`);
  };

  return { setAuthParams, authMode };
};
