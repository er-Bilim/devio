import type { Roadmap } from '@/entities/roadmap';

interface RoadmapHeaderProps {
  roadmap: Roadmap;
}

export function RoadmapHeader({ roadmap }: RoadmapHeaderProps) {
  return (
    <header className="relative z-10 pt-7.5 pb-10 border-b border-b-line">
      <div className="flex items-center gap-4.5 mb-4">
        <p
          className="uppercase w-14 h-14 rounded-full grid place-items-center shrink-0 border-3 border-accent text-accent bg-night font-display font-bold text-[22px] shadow-[0_0_30px_-6px_var(--accent)]"
          style={
            {
              '--accent': 'var(--mint)',
            } as React.CSSProperties
          }
        >
          {roadmap.slug.charAt(0)}
        </p>
      </div>
    </header>
  );
}
