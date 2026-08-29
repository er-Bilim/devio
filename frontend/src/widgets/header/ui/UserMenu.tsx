'use client';

import { useAuth } from '@/entities/user';
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

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
    <div
      className="flex items-center gap-2.5 py-1 pr-2.5 pl-3.5 rounded-full border border-line bg-night/70 cursor-pointer duration-200 hover:border-mint/45 hover:bg-night/30 drop-shadow-[0_0_3px_rgba(62,207,142,0.15)]"
      aria-haspopup="menu"
      aria-expanded="false"
      title="Меню профиля"
    >
      <div className="flex flex-col items-end leading-[1.15]">
        <p className="text-[13.5px] font-semibold text-mist">
          {user.display_name}
        </p>
        <p className="font-mono text-[10.5px] text-mist-soft">
          @{user.username}
        </p>
      </div>
      <div className="w-8.75 h-8.75 rounded-full shrink-0 overflow-hidden relative border-2 border-mint">
        <Image
          src={'/avatars/avatar-soft-3-halo.jpg'}
          alt={`Аватар ${user.username}`}
          fill
          className="rounded-full"
        />
      </div>
    </div>
  );
}
