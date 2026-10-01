import { RoadmapCard } from '@/entities/roadmap/';
import { getRoadmaps } from '@/entities/roadmap/api/server';

export async function DirectionsSection() {
  const roadmaps = await getRoadmaps();

  if (!roadmaps) {
    return null;
  }

  return (
    <section>
      <div className="wrap">
        <div className="head">
          <span className="kicker">Направления</span>
          <h2>Выбери, куда ехать</h2>
          <p>
            Порядок станций уже выверен: что учить, зачем и что после чего.
            Начни с любой ветки – переключиться можно в любой момент.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      </div>
    </section>
  );
}
