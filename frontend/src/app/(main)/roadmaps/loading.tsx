import { Skeleton } from '@/shared/ui/skeleton';
import { DirectionsHeader } from '@/widgets/directions-header';
import { configHubRoadmap } from '@/widgets/directions-map';

export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(700px_440px_at_70%_28%,rgba(62,207,142,.11)_0%,transparent_62%),radial-gradient(640px_420px_at_26%_74%,rgba(77,163,255,.11)_0%,transparent_60%)]" />
      <div className="wrap">
        <DirectionsHeader />
        <section className="space relative w-full aspect-1160/770 mt-2.5 mx-auto z-1">
          {Object.values(configHubRoadmap).map((config, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${config.hub.x}%`, top: `${config.hub.y}%` }}
            >
              <Skeleton className="w-[min(372px,33vw)] h-60 rounded-xl border border-line bg-panel/60 animate-pulse p-10">
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
      </div>
    </>
  );
}
