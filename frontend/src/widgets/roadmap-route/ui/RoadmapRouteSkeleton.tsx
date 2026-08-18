import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export function RoadmapRouteSkeleton() {
  return (
    <section className="pt-14 pb-7.5">
      <Skeleton className="mb-9.5 w-35 h-7 bg-panel/30 animate-pulse border border-line" />

      <div className="relative">
        <ol className="flex flex-col gap-11.5">
          {[...Array(5)].map((_, index) => {
            const isEven = index % 2 === 0;

            return (
              // <Skeleton
              //   key={index}
              //   className={cn(
              //     'relative flex w-35 h-7 bg-panel/30 border border-line animate-pulse',
              //     isEven && 'justify-end',
              //   )}
              // />
              <li
                className={cn('relative flex', isEven && 'justify-end')}
                style={
                  {
                    '--accent': 'var(--mint)',
                  } as React.CSSProperties
                }
              >
                <Skeleton className="w-[calc(50%-66px)] bg-panel/30 border border-line rounded-xl py-5 px-6 relative">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <Skeleton className="w-18 h-7 bg-panel animate-pulse" />
                  </div>
                  <Skeleton className="w-full h-15 bg-panel animate-pulse mt-3" />
                </Skeleton>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
