'use client';
import Link from 'next/link';
import { NAV_ITEMS } from '../model/nav-items';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex gap-1.5">
        {NAV_ITEMS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <li
              key={link.href}
              className={cn(
                'text-muted py-2 px-4 bg-transparent rounded-full text-[13px] hover:bg-[rgba(255,236,230,.05)] hover:text-text cursor-pointer duration-150',
                {
                  'text-text bg-[rgba(224,138,126,.12)]': isActive,
                },
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
