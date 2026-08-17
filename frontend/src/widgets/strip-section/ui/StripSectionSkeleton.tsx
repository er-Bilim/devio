import { Skeleton } from '@/shared/ui/skeleton';

export function StripSectionSkeleton() {
  return (
    <div className="border-t border-b border-line bg-panel-2">
      <div className="wrap grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-6 py-6.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-baseline gap-3 justify-center">
            <Skeleton className="h-6 animte-pulse bg-panel/30 w-1/3 border border-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
