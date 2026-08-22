import { getRoadmaps } from '@/entities/roadmap/api/server';
import { DirectionsDepot } from '@/widgets/directions-depot';
import { DirectionsHeader } from '@/widgets/directions-header';
import { DirectionsMap } from '@/widgets/directions-map';

export default async function Roadmaps() {
  const roadmaps = await getRoadmaps();

  if (!roadmaps) return null;

  return (
    <>
      <div className="aura" />
      <div className="wrap">
        <DirectionsHeader />
        <section className="flex flex-col aspect-auto lg:block gap-4 py-6.5 space relative w-full lg:aspect-1160/770 mt-2.5 mx-auto z-1">
          <DirectionsMap roadmaps={roadmaps} />
        </section>
        <DirectionsDepot roadmaps={roadmaps} />
      </div>
    </>
  );
}
