import { HugeiconsIcon } from '@hugeicons/react';
import {
  Activity03Icon,
  Route01Icon,
  Fire03Icon,
} from '@hugeicons/core-free-icons';
import { RoadmapMiniLine } from '@/entities/roadmap';
import { cn } from '@/shared/lib/utils';

const weeks: string[] = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export function HowDuo() {
  return (
    <>
      <section>
        <div className="flex items-center gap-2.25 mb-0.75">
          <HugeiconsIcon
            icon={Activity03Icon}
            strokeWidth={1.5}
            className="size-3.75 text-mist-soft"
          />
          <h2 className="sec-head">Прогресс и стрик</h2>
        </div>
        <p className="sec-sub mb-6">
          две вещи, которые держат в пути, когда мотивация кончилась
        </p>

        <div className="grid lg:grid-cols-2 gap-8.5">
          <div>
            <h3 className="font-display font-semibold text-[16px] mb-2 flex items-center gap-2.25 text-mist">
              <HugeiconsIcon
                icon={Route01Icon}
                strokeWidth={1.5}
                className="size-4.5 text-mint"
              />
              Ты всегда знаешь, где ты
            </h3>
            <p className="text-[14.5px] text-mist-soft">
              Линия закрашивается по мере движения, текущая станция пульсирует.
              Открыл сайт после перерыва — сразу видно, откуда продолжать
            </p>
            <div className="mt-4 max-w-120">
              <RoadmapMiniLine total={6} filled={3} />
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-[16px] mb-2 flex items-center gap-2.25 text-mist">
              <HugeiconsIcon
                icon={Fire03Icon}
                strokeWidth={1.5}
                className="size-4.5 text-amber"
              />
              Стрик – маленький ритуал
            </h3>
            <p className="text-[14.5px] text-mist-soft">
              Отметил станцию сегодня – счётчик растёт. Пропустил день –
              начинаешь заново. Не наказание, а повод не выпадать из ритма
            </p>

            <div className="flex gap-1.5 mt-4.5">
              {weeks.map((week, index) => {
                const isLast = weeks.length - 1 === index;
                return (
                  <p
                    className={cn(
                      'w-7.5 h-7.5 rounded-md bg-[rgba(36,48,80,.45)] grid place-items-center font-mono text-[12px] text-mist-soft',
                      isLast
                        ? 'bg-amber text-night font-bold border-none shadow-[0_0_16px_-4px_var(--amber)]'
                        : 'bg-[rgba(245,166,35,.16)] text-amber border border-[rgba(245,166,35,.35)]',
                    )}
                    key={index}
                  >
                    {week}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="rule" />
    </>
  );
}
