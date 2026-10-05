import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, CircleCheckIcon } from '@hugeicons/core-free-icons';
import type { IconType } from '@/shared/types/icon';
import { HeroScene } from './HeroScene';

type Perk = {
  icon: IconType;
  title: string;
};

export function HomeHero() {
  const perks: Perk[] = [
    {
      icon: CircleCheckIcon,
      title: 'без оплаты',
    },
    {
      icon: CircleCheckIcon,
      title: 'опыт не нужен',
    },
    {
      icon: CircleCheckIcon,
      title: 'карту можно смотреть без регистрации',
    },
  ];

  return (
    <section className="relative">
      <div className="glow size-130 bg-wine/30 -top-40 -left-50" />

      <div className="wrap grid grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div>
          <span className="eyebrow">
            <div className="pip" />
            Бесплатные роадмапы для входа в IT
          </span>
          <h1 className="font-display font-medium text-[clamp(34px,4.6vw,56px)] leading-[1.08] tracking-[-1.4px] mt-5.5">
            Учиться проще, когда
            <em className="not-italic font text-rose ml-3">видишь дорогу</em>
          </h1>
          <p className="lead">
            Каждое направление – спокойная линия метро: станции по порядку,
            материалы и примеры на каждой. Не нужно гадать, с чего начать и что
            дальше
          </p>
          <div className="flex gap-3 mt-8.5 flex-wrap">
            <Link href={'/roadmaps'} className="btn btn-primary">
              Выбрать направление
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                strokeWidth={2}
                className={`ic`}
              />
            </Link>
            <Link href={'/how'} className="btn btn-soft">
              Как это работает
            </Link>
          </div>
          <div className="flex gap-y-2.5 gap-x-5.5 flex-wrap mt-6.5 text-[14px] text-muted">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <p
                  key={perk.title}
                  className="flex flex-row gap-2 items-center"
                >
                  <HugeiconsIcon
                    icon={Icon}
                    strokeWidth={2}
                    className={`ic text-sage`}
                  />
                  {perk.title}
                </p>
              );
            })}
          </div>
        </div>
        <HeroScene />
      </div>
    </section>
  );
}
