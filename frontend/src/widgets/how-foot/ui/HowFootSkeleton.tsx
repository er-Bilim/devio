import { Skeleton } from "@/shared/ui/skeleton";

export function HowFootSkeleton() {
  return (
    <section className="pt-4 pb-24">
      <Skeleton className="w-1/2 h-10 bg-panel/30 border border-line mx-auto"/>
      <Skeleton className="w-1/3 h-5.5 bg-panel/30 border border-line mx-auto mt-7.5"/>
      <Skeleton className="w-1/3 h-11 bg-panel/30 border border-line mx-auto mt-9.5"/>
    </section>
  )
}