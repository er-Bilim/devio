import { HugeiconsIcon } from '@hugeicons/react';
import { CircleIcon } from '@hugeicons/core-free-icons';

export function DirectionsHeader() {
  const seg = 'w-[clamp(60px,10vw,110px)] h-0.5 rounded-xs';

  return (
    <header className="relative z-10 pt-15.5 text-center">
      <p className="font-mono text-[12px] tracking-[.2em] text-mist-soft uppercase mb-4.5">
        Схема сети
      </p>
      <h1 className="font-display font-semibold text-[clamp(32px,2vw,40px)] tracking-[-.8px] leading-[1.1] mb-7 text-mist">
        Выбери свою линию
      </h1>

      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-2 mb-4.5"
      >
        <span
          className={`${seg}`}
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, var(--color-mint))`,
          }}
        />
        <HugeiconsIcon
          icon={CircleIcon}
          strokeWidth={3}
          className="size-2.5 text-mist-soft"
        />
        <span
          className={`${seg}`}
          style={{
            backgroundImage: `linear-gradient(90deg, var(--color-signal), transparent)`,
          }}
        />
      </div>

      <p className="text-mist-soft text-[15.5px] max-w-[46ch] mx-auto mb-4.5">
        Две линии открыты, две –
        <span className="text-mist font-medium ml-1">в депо</span>. Наведи на
        карточку, чтобы увидеть её станции
      </p>
    </header>
  );
}
