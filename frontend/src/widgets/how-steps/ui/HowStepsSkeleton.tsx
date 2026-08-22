import { Skeleton } from '@/shared/ui/skeleton';

export function HowStepsSkeleton() {
  return (
    <>
      <section>
        <Skeleton className="w-40 h-6 bg-panel/30 border border-line mb-3" />
        <Skeleton className="w-1/3 h-5 bg-panel/30 border border-line mb-6" />

        <div className="pl-10.5 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="pb-10.5 mt-2">
              <Skeleton className="w-25 h-4.25 bg-panel/30 border border-line" />
              <Skeleton className="mt-1.25 mb-2 w-45 h-7 bg-panel/30 border border-line" />
              <Skeleton className="mt-1.25 mb-2 max-w-[58ch] h-20 bg-panel/30 border border-line" />
              <Skeleton className="mt-1.25 mb-2 w-1/2 h-7.5 bg-panel/30 border border-line" />
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />
    </>
  );
}
