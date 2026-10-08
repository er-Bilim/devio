import { Logo } from '@/shared/ui/logo';
import { NavLinks } from './NavLinks';
import Link from 'next/link';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="py-4.5 px-0">
      <div className="wrap">
        <div className="flex items-center justify-between gap-6 py-2 pr-2.5 pl-5.5 rounded-full bg-[rgba(32,24,25,.72)] ring-1 ring-inset ring-line backdrop-blur-[14px]">
          <Link href="/">
            <Logo size={28} />
          </Link>
          <NavLinks />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
