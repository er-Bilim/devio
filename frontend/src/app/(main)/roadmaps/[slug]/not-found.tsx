'use client';

import { MetroScene } from '@/shared/ui/metro-scene';
import { HugeiconsIcon } from '@hugeicons/react';
import { MapingIcon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap flex items-center justify-center">
      <div className="max-w-140 w-full mx-auto text-center absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <MetroScene variant="empty" />
        <p className="font-mono text-[12.5px] tracking-[.14em] text-signal uppercase mb-7">
          Станция не найдена
        </p>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-1.25 mb-7.5 text-mist ">
          Поезд дальше не идёт
        </h1>
        <p className="text-mist-soft text-[16px] max-w-[42ch] mx-auto mb-7.5">
          Роадмапа по этому адресу нет на карте – ссылка устарела или такую
          станцию ещё не построили
        </p>

        <div className="flex gap-4.5 justify-center flex-wrap">
          <Link
            href="/roadmaps"
            className="py-3 px-6.5 text-[15px] bg-signal text-night font-bold rounded-lg hover:bg-azure duration-300 flex items-center gap-2.25"
          >
            К карте роадмапов
            <HugeiconsIcon
              icon={MapingIcon}
              strokeWidth={2.5}
              className="size-4 text-night"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.25 py-3 px-6.5 font-bold text-[15px] border border-line bg-transparent text-mist rounded-lg hover:border-signal hover:text-signal duration-300"
          >
            На главную
          </Link>
        </div>
      </div>
    </section>
  );
}
