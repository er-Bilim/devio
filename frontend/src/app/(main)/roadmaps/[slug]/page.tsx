import { getRoadmap, getRoadmaps } from '@/entities/roadmap/api/server';
import { notFound } from 'next/navigation';
import { RoadmapHeader } from '@/widgets/roadmap-header';
import { RoadmapRoute } from '@/widgets/roadmap-route';

interface RoadmapProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: RoadmapProps) => {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  return {
    title: roadmap?.title ?? 'Роадмап',
    description: roadmap?.description ?? 'Описание роадмапа',
  };
};

export const generateStaticParams = async () => {
  try {
    const roadmaps = await getRoadmaps();
    if (!roadmaps) return [];
    return roadmaps.map((roadmap) => ({ slug: roadmap.slug }));
  } catch {
    console.warn('Back is unavailable, print run skipped');
    return [];
  }
};

export default async function Roadmap({ params }: RoadmapProps) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);

  if (!roadmap) notFound();

  return (
    <div className="wrap pb-20">
      <div className="aura" />
      <RoadmapHeader roadmap={roadmap} />
      <RoadmapRoute roadmap={roadmap} />
    </div>
  );
}
