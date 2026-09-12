'use client';
import { ErrorNotFoundIcon } from '@/shared/ui/error-not-found-ic';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home07Icon,
  Link02Icon,
  TextFontIcon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex-1 grid place-items-center pt-15 px-7 pb-22.5 relative z-10">
      <div className="aura" />
      <div className="w-full max-w-105 mx-auto mb-10">
        <svg
          viewBox="0 0 420 150"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          className="flex items-center justify-center mx-auto"
        >
          <ErrorNotFoundIcon cx="210" cy="120" textY="125" />
        </svg>
      </div>

      <div className="kicker">
        <p>станция не найдена</p>
      </div>
      <h1 className="font-display font-semibold text-[clamp(24px,2.5vw,25px)] tracking-[-.6px] text-mist">
        Такого пассажира нет на линии
      </h1>

      <div className="mt-4.5 py-2 px-4 rounded-full border border-line bg-[rgba(18,26,46,.5)] font-mono text-[13px] text-mist-soft">
        <p>неизвестный пользователь</p>
      </div>

      <p className="text-mist-soft text-[15.5px] mt-5 max-w-[46ch] text-center">
        Профиль с таким ником не существует – возможно, в адресе опечатка или
        человек ещё не начал свой маршрут.
      </p>

      <div className="flex flex-col gap-2.75 mt-7.5 text-left max-w-95">
        <div className="flex items-start gap-2.75 text-[13.5px] text-mist-soft">
          <HugeiconsIcon
            icon={TextFontIcon}
            strokeWidth={2}
            className="hidden lg:block size-5"
          />
          <span>
            Проверь написание: ники чувствительны к точкам и подчёркиваниям
          </span>
        </div>
        <div className="flex items-start gap-2.75 text-[13.5px] text-mist-soft">
          <HugeiconsIcon
            icon={Link02Icon}
            strokeWidth={2}
            className="hidden lg:block size-5"
          />
          <span>Если ссылку прислали – возможно, профиль был удалён</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-9 flex-wrap">
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-2.25 py-3.25 px-6.5 rounded-lg font-bold text-[14px] bg-mint text-night shadow-[0_14px_32px_-14px_rgba(62,207,142,.9)]"
        >
          Смотреть направления
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            className="hidden lg:block size-5"
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2.25 py-3.25 px-6 rounded-lg font-semibold text-[14px] text-mist-soft border border-line"
        >
          <HugeiconsIcon
            icon={Home07Icon}
            strokeWidth={2}
            className="hidden lg:block size-5"
          />
          На главную
        </Link>
      </div>

      <p className="mt-8.5 font-mono text-[11.5px] text-mist-soft">
        код 404 – профиль не найден
      </p>
    </section>
  );
}
