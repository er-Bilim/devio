import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { TradeUpIcon } from '@hugeicons/core-free-icons';
import { RoadmapMiniLine } from '@/entities/roadmap/';
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
            <Link
              key={roadmap.id}
              href={`/roadmaps/${roadmap.slug}`}
              className="relative bg-panel border border-line p-6.5 rounded-xl hover:border-signal transform hover:-translate-y-0.5 duration-200"
            >
              <div className="flex items-center justify-between mb-4.5">
                <p className="font-display font-semibold text-[19px] text-mist">
                  {roadmap.title}
                </p>
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-mist-soft">
                  <HugeiconsIcon
                    icon={TradeUpIcon}
                    strokeWidth={1.8}
                    className="size-4 text-amber"
                  />
                  <span>64% выбирают</span>
                </div>
              </div>

              <div className="mt-1.5 mb-4">
                <RoadmapMiniLine total={roadmap.stages.length} filled={3} />
              </div>

              <p className="text-mist-soft text-[14.5px] mb-4.5">
                {roadmap.description}
              </p>
              <div className="flex gap-4.5 font-mono text-[12px] text-mist-soft">
                <p>
                  <i className="text-signal">{roadmap.stages.length}</i> станций
                </p>
                <p>
                  <i className="text-signal">~4</i> месяца
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
