import { Skeleton } from '@/shared/ui/skeleton';

export function HowSectionSkeleton() {
  return (
    <section className="pt-0">
      <div className="wrap">
        <div className="mb-11 max-w-[60ch]">
          <Skeleton className="h-4.5 w-[25%] bg-panel animate-pulse mb-4.5" />
          <Skeleton className="h-11 w-[75%] bg-panel animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-53.5 w-full bg-panel animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
