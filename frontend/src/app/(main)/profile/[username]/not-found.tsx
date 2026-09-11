'use client';

import { ErrorNotFoundIcon } from '@/shared/ui/error-not-found-ic';

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
          <ErrorNotFoundIcon cx="210" cy="60" textY="65" />
        </svg>
      </div>

      <div className="kicker">
        <p>станция не найдена</p>
      </div>
      <h1 className="font-display font-semibold text-[clamp(24px,2.5vw,25px)] tracking-[-.6px] text-mist">
        Такого пассажира нет на линии
      </h1>
    </section>
  );
}
