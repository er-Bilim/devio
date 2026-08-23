import { Skeleton } from '@/shared/ui/skeleton';

export function RoadmapHeaderSkeleton() {
  return (
    <>
      <div className="flex justify-center">
        <div className="w-full flex flex-row items-center justify-center py-10 gap-3">
          {[...(Array(3) as number[])].map((_, i) => (
            <Skeleton
              key={i}
              className="w-13 h-4.5 bg-panel/30 border border-line"
            />
          ))}
        </div>
      </div>
      <div className="relative pt-3 pb-10 border-b border-b-line text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center lg:flex-row gap-3">
            <Skeleton className="w-14 h-14 rounded-full bg-panel/30 border border-line" />
            <div>
              <div className="flex flex-col gap-3 lg:gap-15 lg:flex-row items-center">
                <Skeleton className="w-30 lg:w-56 h-11.5 bg-panel/30 border border-line" />
                <Skeleton className="w-25 h-6 bg-panel/30 border border-line" />
              </div>
              <div className="flex flex-col mt-5 lg:mt-8 lg:flex-row gap-3 lg:items-center">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton
                    key={i}
                    className="w-30 lg:w-17 h-3 bg-panel/30 border border-line"
                  />
                ))}
              </div>
            </div>
          </div>
          <Skeleton className="mt-6 w-1/3 h-10 bg-panel/30 border border-line" />
        </div>
      </div>
    </>
  );
}
