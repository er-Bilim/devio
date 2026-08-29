'use client';
import Link from 'next/link';
import { NAV_ITEMS } from '../model/nav-items';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="hidden md:flex gap-7 text-[14.5px] font-medium">
        {NAV_ITEMS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <li
              key={link.href}
              className={cn(
                'text-mist-soft hover:text-mist',
                isActive && 'text-mint',
              )}
            >
              <Link href={link.href} className="relative w-full">
                <p>{link.label}</p>
                {isActive && (
                  <div className="flex flex-row items-center mt-1">
                    <div className="h-0.5 w-full bg-[linear-gradient(90deg,var(--mint)_0%,transparent_50%,var(--mint)_100%)]" />
                    <div className="w-3 h-3 bg-night border-2 border-mint rounded-full absolute left-1/2 -translate-x-1/2" />
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
