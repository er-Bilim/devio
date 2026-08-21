import { getRoadmaps } from '@/entities/roadmap/api/server';
import { HowHeader } from '@/widgets/how-header';
import { HowPeek } from '@/widgets/how-peek';
import { HowSteps } from '@/widgets/how-steps';
import { HowDuo } from '@/widgets/how-duo';
import { HowFaq } from '@/widgets/how-faq';

export default async function HowPage() {
  const roadmaps = await getRoadmaps();
  const firstRoadmap = roadmaps?.[0];

  return (
    <div className="wrap">
      <HowHeader />
      <HowSteps />
      {firstRoadmap && <HowPeek roadmap={firstRoadmap} />}
      <HowDuo />
      <HowFaq />
    </div>
  );
}
