'use client';

import { useAuth } from '@/entities/user';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Logout03Icon,
  Route01Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import { useState } from 'react';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
};

export function UserMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();

  if (!user)
    return (
      <Link
        href="/auth"
        className="inline-flex items-center gap-2.25 py-2.75 px-6 font-bold text-[15px] font-body border border-line text-mist rounded-xl duration-150 hover:border-signal hover:text-signal"
      >
        Войти
      </Link>
    );

  const menuItems: MenuItem[] = [
    { label: 'Профиль', href: '/profile', icon: User02Icon },
    { label: 'Мой маршрут', href: '/route', icon: Route01Icon },
  ];

  return (
    <>
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex items-center gap-4 py-6 pr-2.5 pl-5.5 rounded-full border border-line bg-night/70 cursor-pointer duration-200 hover:border-mint/45 hover:bg-night/30 drop-shadow-[0_0_3px_rgba(62,207,142,0.15)]"
            aria-haspopup="menu"
            aria-expanded="false"
            title="Меню профиля"
          >
            <div className="flex flex-col items-start leading-[1.15] pl-3">
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
            <HugeiconsIcon
              icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
              strokeWidth={1.5}
              className="size-3.5 text-mint"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-75 p-2 bg-night/70 border-line shadow-[0_28px_60px_-28px_rgba(0,0,0,0.9)] pointer-events-none drop-shadow-[0_0_3px_rgba(62,207,142,0.15)] rounded-xl mt-3 backdrop-blur-xl">
          <div className="p-3 border-b border-b-line mb-1.5">
            <p className="text-mist font-display font-semibold text-[14.5px]">
              {user.display_name}
            </p>
            <p className="font-mono text-[11px] text-mist-soft">{user.email}</p>
          </div>
          <ul className="border-b border-b-line py-2.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.href}
                  className="duration-200 hover:bg-mint/10 rounded-xl"
                >
                  <Link
                    href={item.href}
                    className="text-mist-soft flex items-center gap-2.75 w-full py-2.5 px-3 text-[14px] text-left font-body duration-200 group"
                  >
                    <HugeiconsIcon
                      icon={Icon}
                      strokeWidth={1.5}
                      className="size-4 text-mist-soft group-hover:text-mint"
                    />
                    <p className="group-hover:text-mint">{item.label}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button
            className="py-2.5 bg-transparent w-full text-alarm mt-2 duration-200 hover:bg-alarm/10 flex items-start justify-start rounded-xl"
            onClick={logout}
          >
            <HugeiconsIcon
              icon={Logout03Icon}
              strokeWidth={1.8}
              className="size-4 text-alarm"
            />
            <span>Выйти</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
