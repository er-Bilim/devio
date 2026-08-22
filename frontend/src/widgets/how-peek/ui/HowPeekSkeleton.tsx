import { Skeleton } from '@/shared/ui/skeleton';

export function HowPeekSkeleton() {
  return (
    <>
      <section>
        <Skeleton className="w-40 h-6 bg-panel/30 border border-line mb-3" />
        <Skeleton className="w-1/3 h-5 bg-panel/30 border border-line mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6.5 items-center">
          <Skeleton className="bg-panel/30 border border-line py-5 px-5.5 rounded-xl">
            <div className="flex items-baseline justify-between gap-2.5 mb-1.75">
              <Skeleton className="w-30 h-6.5 bg-panel mr-2.5" />
              <Skeleton className="w-20 h-3.5 bg-panel" />
            </div>
            <Skeleton className="w-full h-12 bg-panel" />

            <div className="flex gap-1.75 flex-wrap mt-3">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="w-20 h-6 bg-panel" />
              ))}
            </div>
          </Skeleton>

          <div className="flex flex-col gap-3.75">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-5 bg-panel/30 border border-line"
              />
            ))}
          </div>
        </div>
      </section>
      <div className="rule" />
    </>
  );
}
