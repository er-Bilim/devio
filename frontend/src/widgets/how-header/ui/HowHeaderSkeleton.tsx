import { Skeleton } from '@/shared/ui/skeleton';

export function HowHeaderSkeleton() {
  return (
    <>
      <div className="pt-17.5 pb-1 text-center">
        <Skeleton className="h-4.5 w-25 bg-panel/30 mx-auto border border-line mb-4" />
        <Skeleton className="w-[clamp(250px,25vw,550px)] h-8.75 mx-auto bg-panel/30 border border-line mb-7" />
        <Skeleton className="max-w-[52ch] mt-4.5 h-10 bg-panel/30 border border-line mx-auto" />
        <Skeleton className="max-w-105 mt-8.5 h-7 bg-panel/30 border border-line mx-auto" />
      </div>

      <div className="rule" />
    </>
  );
}
