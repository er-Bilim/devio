import { RoadmapMiniLine } from '@/entities/roadmap';

export function HowHeader() {
  return (
    <>
      <header className="pt-17.5 pb-1 text-center relative z-10">
        <p className="kicker">как это работает</p>
        <h1 className="font-display font-semibold text-[clamp(32px,2vw,40px)] tracking-[-.8px] leading-[1.1] mb-7 text-mist">
          Учиться – как ехать по линии
        </h1>

        <p className="text-mist-soft text-[17px] max-w-[52ch] mt-4.5 mx-auto">
          Никакого «что учить дальше?» в три часа ночи. Выбираешь направление –
          и едешь по станциям в порядке, который уже проверен.
        </p>
        <div className="mt-8.5 max-w-105 mx-auto">
          <RoadmapMiniLine total={5} filled={3} />
        </div>
      </header>

      <div className="rule" />
    </>
  );
}
