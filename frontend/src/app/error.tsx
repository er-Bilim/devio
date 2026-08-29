'use client';
import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh01Icon } from '@hugeicons/core-free-icons';
import { MetroScene } from '@/shared/ui/metro-scene';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

interface ErrorProps {
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <section className="grid place-items-center overflow-hidden px-6 min-h-screen">
      <div className="max-w-140 w-full mx-auto text-center">
        <MetroScene variant="broken" />
        <p className="font-mono text-[12.5px] tracking-[.14em] text-alarm uppercase mb-10">
          {'// сбой на линии'}
        </p>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] lg:leading-1.25 mb-10 text-mist">
          Поезд дальше не идёт
        </h1>
        <p className="text-mist-soft text-[16px] max-w-[42ch] mx-auto mb-7.5">
          Не получилось загрузить данные – обрыв где-то между нами и сервером.
          Обычно это на минуту: попробуй снова
        </p>

        <div className="flex gap-4.5 justify-center flex-wrap">
          <Button
            type="button"
            className="inline-flex items-center gap-2.25 py-6 w-55 font-bold text-[15px] border border-transparent bg-signal text-night hover:bg-azure"
            onClick={reset}
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              strokeWidth={1.8}
              className="size-4 text-night"
            />
            Попробовать снова
          </Button>
          <Link
            className="inline-flex items-center justify-center gap-2.25 py-3 px-6.5 font-bold text-[15px] border border-line bg-transparent text-mist rounded-lg hover:border-signal hover:text-signal duration-300"
            href="/"
          >
            На главную
          </Link>
        </div>

        <p className="mt-6.5 font-mono text-[12px] text-mist-soft">
          Если повторяется – мы уже чиним пути
        </p>
      </div>
    </section>
  );
}
