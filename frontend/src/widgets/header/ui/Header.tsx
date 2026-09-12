import { Logo } from '@/shared/ui/logo';
import { NavLinks } from './NavLinks';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { DotIcon } from '@hugeicons/core-free-icons';
import { UserMenu } from './UserMenu';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(11,16,32,0.82)] backdrop-blur-[10px] border-b border-line">
      <div className="flex items-center justify-between h-16 mx-auto px-6 gap-10">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-start gap-4 flex-row">
            <Logo />
            <p className="font-display font-bold text-[20px] text-mist inline-flex items-end gap-1">
              devio
              <HugeiconsIcon
                icon={DotIcon}
                strokeWidth={7}
                className="size-4 text-signal"
              />
            </p>
          </Link>
          <div className="hidden md:flex">
            <NavLinks />
          </div>
        </div>
        <div className="hidden md:flex md:justify-start md:items-start">
          <UserMenu />
        </div>
        <div className="flex md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
