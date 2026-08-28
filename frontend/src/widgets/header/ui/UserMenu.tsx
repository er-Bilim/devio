'use client';

import { useAuth } from '@/entities/user';
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';

export function UserMenu() {
  const { user, status } = useAuth();

  // if (status === 'loading') {
  //   return <Skeleton className="h-9 w-24 animate-pulse rounded-lg bg-panel" />;
  // }

  if (!user)
    return (
      <Link
        href="/auth"
        className="inline-flex items-center gap-2.25 py-2.75 px-6 font-bold text-[15px] font-body border border-line text-mist rounded-xl duration-150 hover:border-signal hover:text-signal"
      >
        Войти
      </Link>
    );

  return (
    <div>
      <div className='flex items-center gap-3'>
        <p className="w-8.5 h-8.5 rounded-full bg-signal grid place-items-center font-bold text-[14px] text-night cursor-pointer uppercase">
          {user.display_name.charAt(0)}
        </p>
        <p className="text-">@{user.username}</p>
      </div>
    </div>
  );
}
