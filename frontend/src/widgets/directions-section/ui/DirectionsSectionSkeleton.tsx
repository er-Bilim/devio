import { Skeleton } from '@/shared/ui/skeleton';

export function DirectionsSectionSkeleton() {
  return (
    <section className="py-20">
      <div className="wrap">
        <div className="mb-11 max-w-[60ch]">
          <Skeleton className="h-4.5 w-[25%] bg-panel/30 animate-pulse mb-3 border border-line" />
          <Skeleton className="h-11 w-[65%] bg-panel/30 animate-pulse border border-line" />
          <Skeleton className="h-11 w-[85%] bg-panel/30 animate-pulse mt-3 border border-line" />
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton
              key={i}
              className="h-55 w-full bg-panel/30 animate-pulse border border-line"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
