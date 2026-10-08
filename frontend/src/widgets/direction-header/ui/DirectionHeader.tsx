export function DirectionHeader() {
  return (
    <section className="relative pt-13 pb-2">
      <div className="wrap">
        <div className="flex items-end justify-between gap-7 flex-wrap">
          <div>
            <span className="kicker">Направления</span>
            <h1 className="font-display font-medium text-[clamp(34px,4.4vw,52px)] tracking-[-1.3px] leading-[1.08] mt-3">
              Выбери свою линию
            </h1>
            <p className="text-muted text-[17px] max-w-[48ch] mt-4">
              Две линии уже открыты, ещё две строятся. Порядок станций выверен –
              просто начни с первой
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
