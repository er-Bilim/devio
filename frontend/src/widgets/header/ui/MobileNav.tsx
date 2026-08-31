'use client';

import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { NAV_ITEMS } from '../model/nav-items';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Logout03Icon,
  SquareArrowRight02Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import Image from 'next/image';
import { useAuth } from '@/entities/user';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

export function MobileNav() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <DropdownMenu onOpenChange={toggleActive}>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-10.5 h-10.5 rounded-3.25 border border-line bg-[rgba(18,26,46,.7)] grid place-items-center duration-200 hover:border-[rgba(62,207,142,.45)] hover:bg-[rgba(18,26,46,.7)]"
            aria-label="Меню"
            aria-expanded={isActive}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5.5 h-5.5 overflow-visible"
            >
              <path
                className={cn(
                  'rail stroke-mist-soft stroke-2',
                  isActive && 'stroke-mint',
                )}
                d="M12 4 V20"
                strokeLinecap="round"
              />
              <circle
                className={cn(
                  'fill-night stroke-mist-soft stroke-2',
                  isActive && 'stroke-mint',
                )}
                cx="12"
                cy="4.5"
                r="3.6"
              />
              <circle
                className={cn(
                  'fill-night stroke-mist-soft stroke-2',
                  isActive && 'stroke-mint fill-mint',
                )}
                cx="12"
                cy="12"
                r="3.6"
              />
              <circle
                className={cn(
                  'fill-night stroke-mist-soft stroke-2',
                  isActive && 'stroke-mint',
                )}
                cx="12"
                cy="19.5"
                r="3.6"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-screen px-5.5 pt-5.5 pb-6.5 z-30 bg-[linear-gradient(180deg,rgba(15,22,42,.99),rgba(11,16,32,.99))] border-transparent border-b border-b-line shadow-[0_30px_60px_-30px_rgba(0,0,0,.95)] rounded-none"
          align="center"
        >
          <ul className="steps relative pl-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="relative">
                <DropdownMenuItem asChild>
                  <Link
                    href={item.href}
                    className="w-full flex items-center justify-between py-3.5 text-[15px] text-mist-soft duration-200 group"
                  >
                    <span className="group-hover:text-mist transition-colors">
                      {item.label}
                    </span>
                    <HugeiconsIcon
                      icon={SquareArrowRight02Icon}
                      strokeWidth={1.8}
                      className="size-4 stroke-mist-soft group-hover:text-mist transition-colors"
                    />
                  </Link>
                </DropdownMenuItem>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="flex items-center gap-3 mt-5 pt-4.5 border-t border-t-mist-soft/20 justify-between w-full">
              <div className="flex items-center flex-row-reverse gap-2.5">
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
              <div className="flex gap-2">
                <Link
                  href="/profile"
                  title="Профиль"
                  className="grid place-items-center w-9.5 h-9.5 rounded-lg border border-line bg-[rgba(18,26,46,.7)] duration-200 hover:border-mist-soft"
                >
                  <HugeiconsIcon
                    icon={User02Icon}
                    strokeWidth={1.8}
                    className="size-4 text-mist"
                  />
                </Link>
                <Button
                  className="grid place-items-center w-9.5 h-9.5 rounded-lg border border-line bg-[rgba(18,26,46,.7)] duration-200 hover:bg-[rgba(18,26,46,.7)] hover:border-alarm"
                  onClick={logout}
                >
                  <HugeiconsIcon
                    icon={Logout03Icon}
                    strokeWidth={1.8}
                    className="size-4 text-alarm"
                  />
                </Button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2.25 py-2.75 font-bold text-[15px] font-body border border-line text-mist rounded-xl duration-150 hover:border-signal hover:text-signal w-full mt-5"
            >
              Войти
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
