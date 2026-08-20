import { cn } from '@/shared/lib/utils';
import type { Stage } from '../model/types';
import { padNumber, pluralize } from '@/shared/lib/format';
import Link from 'next/link';
import type { Roadmap } from '../model/types';

interface StationCardProps {
  roadmap: Roadmap;
  stage: Stage;
}

export function StationCard({ roadmap, stage }: StationCardProps) {
  const isEven = stage.position % 2 === 0;

  return (
    <li
      className={cn('relative flex justify-start pl-9.5 lg:pl-0', isEven && 'lg:justify-end')}
      style={
        {
          '--accent': 'var(--mint)',
        } as React.CSSProperties
      }
    >
      <div
        className="absolute left-2.5 lg:left-1/2 top-6.5 w-4.75 h-4.75 rounded-full -translate-x-1/2 bg-night border-3 border-accent z-20"
        aria-hidden="true"
      />
      <div
        className={cn(
          'left-3.5 right-auto m-0 w-5.5 absolute top-8.25 h-[2.5px] lg:w-15 z-10 bg-[repeating-linear-gradient(90deg,var(--accent)_0_6px,transparent_6px_15px)] opacity-85 lg:right-1/2 lg:left-auto',
          isEven && 'lg:left-1/2 lg:ml-2',
        )}
        aria-hidden="true"
      />
      <article className="w-full lg:w-[calc(50%-66px)] bg-[linear-gradient(160deg,rgba(19,28,50,.95)_0%,rgba(11,16,32,.95)_100%)] border border-line rounded-xl py-5 px-6 relative duration-300 hover:border-accent hover:-translate-y-0.75 hover:shadow-[0_20px_44px_-28px_var(--accent)]">
        <Link href={`/roadmaps/${roadmap.slug}/station/${stage.title}`}>
          <div className="flex items-baseline justify-between  gap-3 mb-1.5">
            <h3 className="font-display font-medium text-[17px] text-mist">
              <span className="text-accent font-mono text-[11.5px] mr-2.5">
                {padNumber(stage.position)}
              </span>
              {stage.title}
            </h3>
            <div className="font-mono text-[11.5px] text-mist-soft whitespace-nowrap inline-flex gap-2">
              <span>~{stage.duration_weeks}</span>
              <span>
                {pluralize(stage.duration_weeks, 'неделя', 'недели', 'недель')}
              </span>
            </div>
          </div>
          <p className="text-mist-soft mb-5">{stage.description}</p>
          <div className="flex gap-2 flex-wrap">
            {stage.topics.map((topic, index) => (
              <span
                className="font-mono text-[11px] py-1 px-2.75 border border-line rounded-full text-mist-soft"
                key={topic + index}
              >
                {topic}
              </span>
            ))}
          </div>
        </Link>
      </article>
    </li>
  );
}
