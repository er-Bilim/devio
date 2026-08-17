import { getRoadmap } from '@/entities/roadmap/api/server';
import { notFound } from 'next/navigation';
import { RoadmapHeader } from '@/widgets/roadmap-header';

interface RoadmapProps {
  params: Promise<{ slug: string }>;
}

export default async function Roadmap({ params }: RoadmapProps) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);

  if (!roadmap) notFound();

  return (
    <div className='wrap'>
      <RoadmapHeader roadmap={roadmap} />
    </div>
  );
}
