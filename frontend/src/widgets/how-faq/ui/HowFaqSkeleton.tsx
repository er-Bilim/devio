import { Skeleton } from '@/shared/ui/skeleton';

export function HowFaqSkeleton() {
  return (
    <section>
      <Skeleton className="w-40 h-6 bg-panel/30 border border-line mb-3" />
      <Skeleton className="w-1/3 h-5 bg-panel/30 border border-line mb-6" />

      <div className="border border-line rounded-xl">
        <div className="w-full">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="py-4 px-10">
              <Skeleton className="h-7 bg-panel/30 border border-line px-15" />
            </div>
          ))}
        </div>
      </div>

      <div className="rule" />
    </section>
  );
}
