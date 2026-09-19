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
                  <div className="w-full absolute flex flex-row items-center mt-1 top-9.5 h-0.5 bg-mint ">
                    <div className="w-3 h-3 bg-night border-2 border-mint rounded-full absolute left-1/2 -translate-x-1/2 shadow-[0_0_10px_2px_var(--mint)]" />
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
