import { PopularityCard, HighlightsCard } from '@/entities/stats';
import { getDirectionStats } from '@/entities/stats/api/server';

export async function StatsSection() {
  const directions = await getDirectionStats();

  if (!directions) return null;
  const active_directions = directions.filter(
    (direction) => direction.status === 'active',
  );

  return (
    <section>
      <div className="wrap">
        <div className="head">
          <span className="kicker">Живая статистика</span>
          <h2>Куда едут остальные</h2>
          <p>Цифры считаются по реальному прогрессу – не по опросам</p>
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] gap-5">
          <PopularityCard popular_directions={active_directions} />
          <HighlightsCard />
        </div>
      </div>
    </section>
  );
}
