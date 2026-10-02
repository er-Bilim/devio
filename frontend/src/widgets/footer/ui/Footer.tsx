import { formatDate } from '@/shared/lib/format';
import Link from 'next/link';

const footerNav: { label: string; href: string; target?: boolean }[] = [
  { label: 'Направления', href: '/roadmaps' },
  { label: 'Как это работает', href: '/how' },
  { label: 'GitHub', href: 'https://github.com/er-Bilim/devio', target: true },
];

export function Footer() {
  const date = formatDate(new Date().toISOString());
  return (
    <footer className="pt-42 pb-14">
      <div className="wrap flex justify-between gap-4 flex-wrap text-faint text-[14px]">
        <span>&copy; {date.year} devio – маршруты в IT</span>
        <nav className="flex flex-row gap-6">
          {footerNav.map((nav) => (
            <Link
              href={nav.href}
              key={nav.label}
              rel="noopener noreferrer"
              target={nav.target ? '_blank' : undefined}
            >
              <span className="hover:text-text duration-200">{nav.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
