'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { MetroScene } from '@/shared/ui/metro-scene';
import { Button } from '@/shared/ui/button';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  console.error(error);

  return (
    <section className="wrap flex items-center justify-center">
      <div className="max-w-140 w-full mx-auto text-center absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <MetroScene variant="broken" />
        <p className="font-mono text-[12.5px] tracking-[.14em] text-alarm uppercase mb-7">
          // Сбой на линии
        </p>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)]  mb-5 text-mist ">
          Движение временно приостановлено
        </h1>
        <p className="text-mist-soft text-[16px] max-w-[42ch] mx-auto mb-7">
          Не получилось загрузить роадмап – проблема на нашей стороне, а не в
          вашем маршруте. Попробуйте ещё раз
        </p>

        <div className="flex gap-4.5 justify-center flex-wrap">
          <Button
            className="py-6 w-55 text-[15px] bg-signal text-night font-bold rounded-lg hover:bg-azure duration-300 flex items-center gap-2.25"
            onClick={reset}
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              strokeWidth={2.5}
              className="size-4 text-night"
            />
            Попробовать снова
          </Button>
          <Link
            href="/roadmaps"
            className="inline-flex items-center justify-center gap-2.25 py-3 px-6.5 font-bold text-[15px] border border-line bg-transparent text-mist rounded-lg hover:border-signal hover:text-signal duration-300"
          >
            К карте роадмапов
          </Link>
        </div>
      </div>
    </section>
  );
}
