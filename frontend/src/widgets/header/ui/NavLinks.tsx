import Link from 'next/link';

export type Link = {
  href: string;
  label: string;
};

interface NavLinksProps {
  links: Link[];
}

export function NavLinks({ links }: NavLinksProps) {
  return (
    <nav>
      <ul className="flex gap-7 text-[14.5px] font-medium">
        {links.map((link) => (
          <li key={link.href} className="text-mist-soft hover:text-mist">
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
