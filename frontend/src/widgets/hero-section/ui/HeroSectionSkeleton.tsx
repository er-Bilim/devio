import { Skeleton } from '@/shared/ui/skeleton';

export function HeroSectionSkeleton() {
  return (
    <section className="relative pt-22 pb-18 overflow-hidden">
      <div className="wrap relative grid items-center grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <Skeleton className="h-4.5 w-3/5 animate-pulse rounded-lg bg-panel mb-4.5" />
          <Skeleton className="h-37 w-3/4 animate-pulse rounded-lg bg-panel mb-5" />
          <Skeleton className="max-w-[46ch] h-25 animate-pulse rounded-lg bg-panel mb-8" />
          <div className="flex gap-3.5 flex-wrap">
            <Skeleton className="w-58 h-11 animate-pule rounded-lg bg-panel" />
            <Skeleton className="w-43 h-11 animate-pule rounded-lg bg-panel" />
          </div>

          <Skeleton className="w-3/4 h-5 animate-pulse rounded-lg bg-panel mt-7" />
        </div>

        <div className="relative">
          <Skeleton className="w-full h-25 animate-pulse rounded-lg bg-panel mb-15" />
          <Skeleton className="w-full h-10 animate-pulse rounded-lg bg-panel" />
        </div>
      </div>
    </section>
  );
}
