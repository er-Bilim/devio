import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export function HeroSectionSkeleton() {
  const defaultDesign: string = 'bg-[rgba(18,26,46,0.55)] border border-line';

  return (
    <section className="relative pt-22 pb-18 overflow-hidden">
      <div className="wrap relative grid items-center grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <Skeleton
            className={cn(
              'h-4.5 w-3/5 animate-pulse rounded-lg mb-4.5',
              defaultDesign,
            )}
          />
          <Skeleton
            className={cn(
              'h-37 w-3/4 animate-pulse rounded-lg  mb-5',
              defaultDesign,
            )}
          />
          <Skeleton
            className={cn(
              'max-w-[46ch] h-25 animate-pulse rounded-lg  mb-8',
              defaultDesign,
            )}
          />
          <div className="flex gap-3.5 flex-wrap">
            <Skeleton
              className={cn('w-58 h-11 animate-pule rounded-lg', defaultDesign)}
            />
            <Skeleton
              className={cn('w-43 h-11 animate-pule rounded-lg', defaultDesign)}
            />
          </div>

          <Skeleton
            className={cn(
              'w-3/4 h-5 animate-pulse rounded-lg mt-7',
              defaultDesign,
            )}
          />
        </div>

        <div className="relative">
          <Skeleton
            className={cn(
              'w-full h-25 animate-pulse rounded-lg mb-15',
              defaultDesign,
            )}
          />
          <Skeleton
            className={cn(
              'w-full h-10 animate-pulse rounded-lg',
              defaultDesign,
            )}
          />
        </div>
      </div>
    </section>
  );
}
