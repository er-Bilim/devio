import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export function HowFoot() {
  return (
    <section className="text-center pt-4 pb-24">
      <h2 className="font-display text-[clamp(21px,2.6vw,27px)] mb-2.5 text-mist">
        Готов сесть в поезд?
      </h2>
      <p className="text-mist-soft mt-6.5">
        Выбери линию – и первая станция уже сегодня
      </p>
      <Link
        href={'/roadmaps'}
        className="inline-flex items-center gap-2.5 py-3.5 px-7.5 rounded-xl font-bold text-[15px] bg-mint text-night shadow-[0_16px_34px_-16px_rgba(62,207,142,.95)] duration-200 hover:-translate-y-0.5 mt-8"
      >
        Смотреть направления
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          strokeWidth={3}
          className="size-2.5 text-night"
        />
      </Link>
    </section>
  );
}
