'use client';

import { useAuth } from '@/entities/user';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  Fire02Icon,
  LogoutCircle01Icon,
  PlayIcon,
} from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { UserAvatar } from '@/entities/user';
import { getMenuItems } from '../model/nav-items';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();

  if (!user)
    return (
      <div className="flex flex-row gap-2">
        <Link href="/auth" className="btn btn-soft btn-sm">
          Войти
        </Link>
        <Link className="btn btn-primary btn-sm" href="/roadmaps">
          Начать бесплатно
        </Link>
      </div>
    );

  const menuItems = getMenuItems(user?.username);

  return (
    <>
      <DropdownMenu modal={false} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              'flex items-center gap-4 py-6 rounded-full border border-faint/10 bg-faint/10 cursor-pointer duration-200 hover:bg-rose/15',
              isOpen && 'bg-rose/15',
            )}
            title="Меню профиля"
          >
            <div className="flex flex-col items-start leading-[1.15] pl-3">
              <p className="text-[13.5px] font-semibold text-mist">
                {user.display_name}
              </p>
            </div>
            <UserAvatar username={user.username} />
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={1.5}
              className={cn(
                'size-4 text-faint duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={20}
          collisionPadding={16}
          className="menu w-85 p-2 rounded-[24px] bg-surface/90 backdrop-blur-[18px] border border-line"
          role="menu"
        >
          <div className="relative flex items-center gap-3.5 p-3.5 rounded-[18px] bg-[linear-gradient(160deg,rgba(224,138,126,.10),transparent_80%)]">
            <div className="flex flex-row items-center gap-3">
              <UserAvatar username={user.username} size={52} />
              <span>
                <b className="block font-semibold text-[15.5px] whitespace-nowrap overflow-hidden text-ellipsis text-text">
                  {user.display_name}
                </b>
                <small className="block text-[13px] text-faint">
                  @{user.username}
                </small>
              </span>
            </div>
            <p className="ml-auto flex items-center gap-1.25 py-1.5 px-2.5 rounded-full bg-sand/15 text-sand font-soft font-extrabold text-[13px]">
              <HugeiconsIcon
                icon={Fire02Icon}
                strokeWidth={1.5}
                className="size-4 text-sand"
              />
              12
            </p>
          </div>
          <Link
            href={`/roadmaps/frontend`}
            className="flex items-center gap-3 mt-1.5 mb-1 py-3 px-3.5 rounded-[16px] bg-text/5 duration-200 hover:bg-text/10"
            role="menuitem"
          >
            <p className="grid place-items-center size-8.5 rounded-[11px] bg-rose/15 text-rose">
              <HugeiconsIcon
                icon={PlayIcon}
                strokeWidth={1.5}
                className="size-4 text-rose"
              />
            </p>
            <div>
              <small className="block text-[12px] text-faint leading-[1.3]">
                Продолжить frontend
              </small>
              <b className="text-[14px] font-semibold text-text">TypeScript</b>
              <div className="flex gap-0.75 mt-1.25">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i
                    key={index}
                    className={cn(
                      'w-3.5 h-1 rounded-full bg-rose',
                      index === 4 && 'bg-text/15',
                    )}
                  />
                ))}
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              strokeWidth={1.5}
              className="size-4 ml-auto text-faint ic"
            />
          </Link>
          <div className="flex flex-col py-1 mb-2">
            {menuItems.map((menu) => {
              const Icon = menu.icon;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="group flex items-center gap-3 py-2.75 px-3.5 rounded-[14px] text-[14.5px] duration-200 hover:bg-text/5"
                >
                  <HugeiconsIcon
                    icon={Icon}
                    strokeWidth={1.5}
                    className="ic text-faint size-4.25 group-hover:text-rose"
                  />
                  <span className="text-muted group-hover:text-text">
                    {menu.title}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col py-1 border-t border-faint/35">
            <Button
              onClick={logout}
              className="flex items-center justify-start gap-3 px-3.5 mt-2 rounded-[14px] text-[14.5px] duration-200 hover:bg-rose/10 bg-transparent py-5"
            >
              <HugeiconsIcon
                icon={LogoutCircle01Icon}
                strokeWidth={1.5}
                className="ic text-rose size-4.25"
              />
              <span className="text-rose">Выйти</span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
