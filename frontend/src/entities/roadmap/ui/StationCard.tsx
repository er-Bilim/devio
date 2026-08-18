import { cn } from '@/shared/lib/utils';
import type { Stage } from '../model/types';
import { padNumber } from '@/shared/lib/format';

interface StationCardProps {
  stage: Stage;
}

export function StationCard({ stage }: StationCardProps) {
  const isEven = stage.position % 2 === 0;

  return (
    <li
      className={cn('relative flex', isEven && 'justify-end')}
      style={
        {
          '--accent': 'var(--mint)',
        } as React.CSSProperties
      }
    >
      <div
        className="absolute left-1/2 top-6.5 w-4.75 h-4.75 rounded-full -translate-x-1/2 bg-night border-3 border-accent z-20"
        aria-hidden="true"
      />
      <div
        className={cn(
          'absolute top-8.25 h-[2.5px] w-15 z-10 bg-[repeating-linear-gradient(90deg,var(--accent)_0_6px,transparent_6px_15px)] opacity-85 right-1/2',
          isEven && 'left-1/2 ml-2',
        )}
        aria-hidden="true"
      />
      <article className="w-[calc(50%-66px)] bg-[linear-gradient(160deg,rgba(19,28,50,.95)_0%,rgba(11,16,32,.95)_100%)] border border-line rounded-xl py-5 px-6 relative duration-300 hover:border-accent hover:-translate-y-0.75 hover:shadow-[0_20px_44px_-28px_var(--accent)]">
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <h3 className="font-display font-medium text-[17px] text-mist">
            <span className="text-accent font-mono text-[11.5px] mr-2.5">
              {padNumber(stage.position)}
            </span>
            {stage.title}
          </h3>
        </div>
        <p className="text-mist-soft text-[13.5px]">
          {stage.description ||
            'Скелет любой страницы: теги, семантика, формы, доступность. Фундамент, на котором стоит всё остальное.'}
        </p>
      </article>
    </li>
  );
}
