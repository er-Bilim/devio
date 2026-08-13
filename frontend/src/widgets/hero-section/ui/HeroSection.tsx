import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, ChampionIcon } from '@hugeicons/core-free-icons';
import { HeroMap } from './HeroMap';
import { RoadmapLine, type Station } from '@/entities/roadmap';

export function HeroSection() {
  const backendStation: Station[] = [
    { title: 'Backend', status: 'next' },
    { title: '', status: 'next' },
    { title: '', status: 'next' },
    { title: '', status: 'next' },
    { title: '', status: 'next' },
  ];

  return (
    <section className="relative pt-22 pb-18 overflow-hidden">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(900px 500px at 15% 0%, #16233F 0%, transparent 60%),
            radial-gradient(700px 420px at 95% 100%, #101B33 0%, transparent 55%)`,
        }}
      />
      <div className="wrap relative grid grid-cols-[1fr_1fr] gap-14 items-center">
        <div>
          <p className="font-mono text-[12.5px] tracking-[.14em] text-signal uppercase mb-4.5">
            Интерактивные роадмапы
          </p>
          <h1 className="font-display font-semibold text-[clamp(30px,3.6vw,46px)] leading-[1.18] tracking-[-.5px] mb-5 text-mist">
            Путь в IT – это карта. <p className="text-signal">Выбери ветку</p> и
            поезжай.
          </h1>
          <p className="text-mist-soft text-[17px] max-w-[46ch] mb-8">
            Каждое направление — линия метро: станции в правильном порядке, с
            материалами и примерами. Твой прогресс виден на карте, а стрик не
            даст сойти с маршрута.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <Link
              className="inline-flex items-center gap-2.25 py-2.75 px-6 rounded-md font-bold text-[15px] font-body border border-transparent bg-signal color-[#071120] hover:bg-[#6ab4ff] active:bg-signal-deep"
              href={'/auth'}
            >
              <span>Выбрать направление</span>
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                strokeWidth={1.8}
                className="size-4"
              />
            </Link>
            <Link
              className="inline-flex items-center gap-2.25 py-2.75 px-6 font-bold text-[15px] font-body border border-line text-mist rounded-md duration-150 hover:border-signal hover:text-signal"
              href={'/'}
            >
              Как это работает
            </Link>
          </div>
          <p className="inline-flex items-center gap-2 mt-7 text-mist-soft text-[13.5px]">
            <HugeiconsIcon
              icon={ChampionIcon}
              strokeWidth={1.8}
              className="size-4 text-amber"
            />
            Бесплатно. Стрик начинается с первой станции.
          </p>
        </div>

        <div className="relative" aria-hidden="true">
          <HeroMap />
          <RoadmapLine stations={backendStation} />
        </div>
      </div>
    </section>
  );
}
