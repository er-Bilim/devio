import { Skeleton } from '@/shared/ui/skeleton';

export function HowDuoSkeleton() {
  return (
    <>
      <section>
        <Skeleton className="w-40 h-6 bg-panel/30 border border-line mb-3" />
        <Skeleton className="w-1/3 h-5 bg-panel/30 border border-line mb-6" />

        <div className="grid lg:grid-cols-2 gap-8.5">
          <div>
            <Skeleton className="w-55 h-5 bg-panel/30 border border-line mb-2" />
            <Skeleton className="w-full h-10 bg-panel/30 border border-line mb-3" />
            <Skeleton className="w-full h-5 bg-panel/30 border border-line" />
          </div>
          <div>
            <Skeleton className="w-55 h-5 bg-panel/30 border border-line mb-2" />
            <Skeleton className="w-full h-10 bg-panel/30 border border-line mb-3" />
            <div className="flex flex-row gap-1.5 mt-4.5">
              {Array.from({ length: 7 }, (_, i) => (
                <Skeleton
                  key={i}
                  className="w-7.5 h-7.5 bg-panel/30 border border-line mb-2"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="rule" />
    </>
  );
}
