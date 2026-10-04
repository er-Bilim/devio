import { HugeiconsIcon } from '@hugeicons/react';
import type { Direction } from '../model/types';
import './StatsCard.css';
import { ArrowRight02Icon, Train01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface SoonPopularityCardProps {
  directions: Direction[];
}

export const SoonPopularityCard = ({ directions }: SoonPopularityCardProps) => {
  return (
    <>
      <div
        className="flex h-3.5 rounded-full overflow-hidden mt-7.5 bg-[repeating-linear-gradient(90deg,rgba(255,236,230,0.09)_0_18px,transparent_18px_26px)]"
        role="img"
        aria-label="Данных пока нет"
      />
      <div className="flex mt-4.5 gap-y-4 gap-x-11 flex-wrap">
        {directions.map((direction) => (
          <div key={direction.slug} className="flex items-baseline gap-2.5">
            <span className="w-2.5 h-2.5 rounded-[3px] self-center bg-text/15" />
            <span className="text-[14px] text-muted">{direction.title}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center mt-6.5 py-4.5 px-5 rounded-(--r-md) bg-rose/5">
        <div className="grid place-items-center w-11 h-11 rounded-[14px] shrink-0 bg-rose/15">
          <HugeiconsIcon
            icon={Train01Icon}
            strokeWidth={2}
            className="ic text-rose"
          />
        </div>
        <div>
          <b className="block font-semibold text-[14.5px] leading-1.35">
            Поезда ещё не вышли на линию
          </b>
          <p className="text-muted text-[13px] leading-5 mt-0.75">
            Цифры появятся, когда первые пассажиры пройдут свои станции
          </p>
        </div>
        <Link
          href="/roadmaps"
          className="ml-auto inline-flex items-center gap-2 shrink-0 h-10 px-4 rounded-full text-[13px] font-medium bg-surface-2 border border-rose/20"
        >
          Стать первым
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            className="ic text-rose"
          />
        </Link>
      </div>

      <div className="foot">Считаем по реальному прогрессу – не по опросам</div>
    </>
  );
};
