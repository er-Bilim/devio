import { Skeleton } from '@/shared/ui/skeleton';

export function DirectionsSectionSkeleton() {
  return (
    <section className="py-20">
      <div className="wrap">
        <div className="mb-11 max-w-[60ch]">
          <Skeleton className="h-4.5 w-[25%] bg-panel animate-pulse mb-3" />
          <Skeleton className="h-11 w-[65%] bg-panel animate-pulse" />
          <Skeleton className="h-11 w-[85%] bg-panel animate-pulse mt-3" />
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-55 w-full bg-panel animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
