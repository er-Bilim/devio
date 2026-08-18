import { Skeleton } from '@/shared/ui/skeleton';

export function RoadmapHeaderSkeleton() {
  return (
    <header className="relative z-10 pt-7.5 pb-10 border-b border-b-line">
      <div className="flex items-center gap-4.5 mb-4">
        <Skeleton className="w-14 h-14 bg-panel/30 border border-line animate-pulse rounded-full" />
        <div>
          <Skeleton className="w-[clamp(85px,11.4vw,350px)] h-11.5 bg-panel/30 border border-line animate-pulse" />
          <div className="flex gap-6 flex-wrap mt-3">
            <Skeleton className="w-15 h-3 bg-panel/30 border border-line animate-pulse" />
            <Skeleton className="w-35 h-3 bg-panel/30 border border-line animate-pulse" />
            <Skeleton className="w-45 h-3 bg-panel/30 border border-line animate-pulse" />
          </div>
        </div>
      </div>
      <Skeleton className="w-1/2 h-10 bg-panel/30 border border-line animate-pulse" />
      <Skeleton className='w-40 h-12 bg-panel/30 border border-line animate-pulse mt-5'/>
    </header>
  );
}
