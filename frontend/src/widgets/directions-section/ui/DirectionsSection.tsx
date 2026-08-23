import { RoadmapCard } from '@/entities/roadmap/';
import { getRoadmaps } from '@/entities/roadmap/api/server';

export async function DirectionsSection() {
  const roadmaps = await getRoadmaps();

  if (!roadmaps) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="wrap">
        <div className="mb-11 max-w-[60ch]">
          <p className="font-mono text-[12px] tracking-[.14em] uppercase text-signal mb-3">
            Направления
          </p>
          <h2 className="font-display font-semibold text-[clamp(24px,2.6vw,32px)] tracking-[-0.4px] text-mist">
            Выбери свою ветку
          </h2>
          <p className="text-mist-soft mt-3">
            Порядок станций выверен: что учить, зачем и что после чего. Никакого
            хаотичного гугления «с чего начать»
          </p>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      </div>
    </section>
  );
}
