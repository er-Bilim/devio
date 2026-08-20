import type { Roadmap } from '@/entities/roadmap';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight02Icon,
  CircleIcon,
  LinerIcon,
} from '@hugeicons/core-free-icons';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { pluralize } from '@/shared/lib/format';

interface RoadmapHeaderProps {
  roadmap: Roadmap;
}

export function RoadmapHeader({ roadmap }: RoadmapHeaderProps) {
  const seg = 'w-[clamp(60px,18vw,275px)] h-0.5 rounded-xs';
  return (
    <>
      <div className="flex justify-center">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Направления', href: '/roadmaps' },
            { label: roadmap.title, href: `/roadmaps/${roadmap.slug}` },
          ]}
        />
      </div>
      <header
        className="relative z-10 pt-3 pb-10 border-b border-b-line text-center"
        style={
          {
            '--accent': 'var(--mint)',
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center lg:flex-row gap-3">
            <p className="uppercase w-14 h-14 rounded-full grid place-items-center shrink-0 border-3 border-accent text-accent bg-night font-display font-bold text-[22px] shadow-[0_0_30px_-6px_var(--accent)]">
              {roadmap.slug.charAt(0)}
            </p>
            <div>
              <div className="flex flex-col gap-3 lg:flex-row justify-between items-center">
                <h1 className="font-display font-semibold text-[clamp(26px,3.4vw,40px)] tracking-[-0.5px] leading-[1.16] text-mist text-start">
                  {roadmap.title}
                </h1>
                <Link
                  href={`/roadmaps/${roadmap.slug}`}
                  className="inline-flex items-center gap-2.25 py-1.25 px-5 rounded-lg font-bold text-[13px] bg-accent text-night duration-300 hover:brightness-[1.12]"
                >
                  Начать ветку
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    strokeWidth={3}
                    className="size-2.5 text-night"
                  />
                </Link>
              </div>
              <div className="flex flex-col mt-8 lg:flex-row lg:gap-3 text-mist-soft text-[12px] lg:mt-3 lg:items-center">
                <p className="inline-flex items-center gap-1 lg:py-0 py-2">
                  <span>{roadmap.stages.length}</span>
                  {pluralize(
                    roadmap.stages.length,
                    'станция',
                    'станции',
                    'станций',
                  )}
                </p>
                <HugeiconsIcon
                  icon={LinerIcon}
                  strokeWidth={3}
                  className="hidden lg:block size-2.5 text-mist-soft"
                />
                <p className="inline-flex items-center gap-1 border-t border-t-line lg:border-none lg:py-0 py-2">
                  <span>4</span>месяца в среднем темпе
                </p>
                <HugeiconsIcon
                  icon={LinerIcon}
                  strokeWidth={3}
                  className="hidden lg:block size-2.5 text-mist-soft"
                />
                <p className="inline-flex items-center border-t border-t-line lg:border-none lg:py-0 py-2">
                  <span className="mr-2 text-amber font-semibold">64%</span>
                  новичков выбирают эту линию
                </p>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-2 mb-4 mt-6"
          >
            <span
              className={`${seg}`}
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, var(--color-mint))`,
              }}
            />
            <HugeiconsIcon
              icon={CircleIcon}
              strokeWidth={3}
              className="size-2.5 text-mist-soft"
            />
            <span
              className={`${seg}`}
              style={{
                backgroundImage: `linear-gradient(90deg, var(--color-mint), transparent)`,
              }}
            />
          </div>
          <p className="text-mist-soft max-w-[58ch] mt-2 mb-6 text-[clamp(14.5px,1vw,16.5px)]">
            {roadmap.description}
          </p>
        </div>
      </header>
    </>
  );
}
