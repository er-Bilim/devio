import type { Roadmap } from '@/entities/roadmap';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

interface RoadmapHeaderProps {
  roadmap: Roadmap;
}

export function RoadmapHeader({ roadmap }: RoadmapHeaderProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Направления', href: '/roadmaps' },
          { label: roadmap.title, href: `/roadmaps/${roadmap.slug}` },
        ]}
      />
      <header
        className="relative z-10 pt-7.5 pb-10 border-b border-b-line"
        style={
          {
            '--accent': 'var(--mint)',
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-4.5 mb-4">
          <p className="uppercase w-14 h-14 rounded-full grid place-items-center shrink-0 border-3 border-accent text-accent bg-night font-display font-bold text-[22px] shadow-[0_0_30px_-6px_var(--accent)]">
            {roadmap.slug.charAt(0)}
          </p>
          <div>
            <h1 className="font-display font-semibold text-[clamp(26px,3.4vw,40px)] tracking-[-0.5px] leading-[1.16] text-mist">
              {roadmap.title}
            </h1>
            <div className="flex gap-6 flex-wrap font-mono text-[13px] text-mist-soft mt-0.5">
              <p className="inline-flex items-center">
                <span className="mr-2 text-mist font-semibold">
                  {roadmap.stages.length}
                </span>
                станций
              </p>
              <p className="inline-flex items-center">
                <span className="mr-2 text-mist font-semibold">4</span>месяца в
                среднем темпе
              </p>
              <p className="inline-flex items-center">
                <span className="mr-2 text-amber font-semibold">64%</span>
                новичков выбирают эту линию
              </p>
            </div>
          </div>
        </div>
        <p className="text-mist-soft text-[16.5px] max-w-[58ch] mt-3.5 mb-6">
          {roadmap.description}
        </p>
        <Link
          href={`/roadmaps/${roadmap.slug}`}
          className="inline-flex items-center gap-2.25 py-3.25 px-7 rounded-lg font-bold text-[15px] bg-accent text-night duration-300 hover:brightness-[1.12]"
        >
          Начать ветку
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={3}
            className="size-2.5 text-night"
          />
        </Link>
      </header>
    </>
  );
}
