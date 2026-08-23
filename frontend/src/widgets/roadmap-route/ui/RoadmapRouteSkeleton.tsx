import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export function RoadmapRouteSkeleton() {
  return (
    <section className="pt-14 pb-7.5">
      <Skeleton className="mb-9.5 w-35 h-7 bg-panel/30 animate-pulse border border-line" />

      <div className="relative">
        <ol className="flex flex-col gap-11.5">
          {Array.from({ length: 5 }, (_, i) => {
            const isEven = i % 2 === 0;

            return (
              <li
                key={i}
                className={cn(
                  'relative flex justify-start',
                  isEven && 'lg:justify-end',
                )}
              >
                <Skeleton className="w-full lg:w-[calc(50%-66px)] bg-panel/30 border border-line rounded-xl py-5 px-6 relative">
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

      <Skeleton className="mt-13.5 mx-auto max-w-130 text-center p-7 bg-panel/30 border border-line rounded-xl flex flex-col items-center">
        <Skeleton className="w-2/3 h-5 bg-panel" />
        <Skeleton className="w-50 h-10 bg-panel mt-5" />
      </Skeleton>
    </section> 
  );
}
