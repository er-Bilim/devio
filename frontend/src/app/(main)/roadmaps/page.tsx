import { getRoadmaps } from '@/entities/roadmap/api/server';
import { DirectionsDepot } from '@/widgets/directions-depot';
import { DirectionsHeader } from '@/widgets/directions-header';
import { DirectionsMap } from '@/widgets/directions-map';

export default async function Roadmaps() {
  const roadmaps = await getRoadmaps();

  if (!roadmaps) return null;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(700px_440px_at_70%_28%,rgba(62,207,142,.11)_0%,transparent_62%),radial-gradient(640px_420px_at_26%_74%,rgba(77,163,255,.11)_0%,transparent_60%)]" />
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
