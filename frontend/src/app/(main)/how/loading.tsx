import { HowHeaderSkeleton } from '@/widgets/how-header';
import { HowStepsSkeleton } from '@/widgets/how-steps';
import { HowPeekSkeleton } from '@/widgets/how-peek';
import { HowDuoSkeleton } from '@/widgets/how-duo';
import { HowFaqSkeleton } from '@/widgets/how-faq';
import { HowFootSkeleton } from '@/widgets/how-foot';

export default function Loading() {
  return (
    <div className="wrap">
      <HowHeaderSkeleton />
      <HowStepsSkeleton />
      <HowPeekSkeleton />
      <HowDuoSkeleton />
      <HowFaqSkeleton />
      <HowFootSkeleton />
    </div>
  );
}
