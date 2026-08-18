import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from './breadcrumb';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

type Item = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: Item[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <BreadcrumbItem
              key={item.href}
              className="relative z-10 pt-5.5 font-mono text-[12.5px] text-mist-soft"
            >
              {!isLast && item.href ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="hover:text-mint">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={3}
                    className="size-2.5 text-mist-soft"
                  />
                </>
              ) : (
                <BreadcrumbPage className="text-mist-soft">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
