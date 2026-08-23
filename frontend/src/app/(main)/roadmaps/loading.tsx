import { Skeleton } from '@/shared/ui/skeleton';
import { DirectionDepotHead } from '@/widgets/directions-depot';
import { DirectionsHeader } from '@/widgets/directions-header';
import { configHubRoadmap } from '@/widgets/directions-map';

export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(700px_440px_at_70%_28%,rgba(62,207,142,.11)_0%,transparent_62%),radial-gradient(640px_420px_at_26%_74%,rgba(77,163,255,.11)_0%,transparent_60%)]" />
      <div className="wrap">
        <DirectionsHeader />
        <section className="mt-8 flex flex-col gap-6 space relative w-full lg:block lg:aspect-1160/770 lg:mt-2.5 mx-auto z-1">
          {Object.values(configHubRoadmap).map((config, i) => (
            <div
              key={i}
              className="static lg:absolute lg:-translate-x-1/2 lg:-translate-y-1/2"
              style={{ left: `${config.hub.x}%`, top: `${config.hub.y}%` }}
            >
              <Skeleton className="w-full lg:w-[min(372px,33vw)] h-70 lg:h-60 rounded-xl border border-line bg-panel/60 animate-pulse p-10">
                <div className="lg:hidden flex flex-row gap-3 mb-5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton
                      key={i}
                      className="w-20 h-7 animate-pulse bg-line"
                    />
                  ))}
                </div>
                <div className="flex flex-row gap-3">
                  <Skeleton className="w-12.5 h-12.5 animate-pulse bg-line rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-40 h-6 animate-pulse bg-line" />
                    <Skeleton className="w-30 h-3 animate-pulse bg-line" />
                  </div>
                </div>
                <Skeleton className="mt-4 w-full h-17 animate-pulse bg-line" />
                <div className="border-t border-t-line mt-4 flex justify-between pt-3">
                  <Skeleton className="w-18 h-3 animate-pulse bg-line" />
                  <Skeleton className="w-25 h-3 animate-pulse bg-line" />
                </div>
              </Skeleton>
            </div>
          ))}
        </section>

        <div className="mt-15 border-t border-t-line pt-8">
          <DirectionDepotHead />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-10">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton
              key={i}
              className="relative w-full h-35 rounded-xl border border-line bg-panel/30 animate-pulse p-7"
            >
              <Skeleton className="w-30 h-5 bg-line" />
              <Skeleton className="w-20 h-5 bg-line absolute right-7 top-7" />
              <Skeleton className="w-full h-10 bg-line mt-7" />
            </Skeleton>
          ))}
        </div>
      </div>
    </>
  );
}
