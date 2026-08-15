import { getRoadmap } from '@/entities/roadmap/api/server';
import { notFound } from 'next/navigation';

interface RoadmapProps {
  params: Promise<{ slug: string }>;
}

export default async function Roadmap({ params }: RoadmapProps) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);

  if (!roadmap) notFound();

  return <h1 className="text-mist">{roadmap.slug}</h1>;
}
