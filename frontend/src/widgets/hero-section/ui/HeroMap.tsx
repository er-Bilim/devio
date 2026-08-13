export function HeroMap() {
  const GAP = 94;
  const width = 16 + GAP * 5 + 16;

  return (
    <svg
      viewBox={`0 0 ${width} 260`}
      className="w-full h-auto overflow-visible block"
    >
      <text className="font-mono text-[12px] fill-mist" x="30" y="48">
        Frontend
      </text>
      <path
        className="fill-none stroke-5 stroke-linecap-round stroke-mint drop-shadow-[0_0_7px_rgba(62,207,142,0.5)]"
        d="M30 70 H210 Q230 70 230 90 V150 Q230 170 250 170 H340"
      />
      <path
        className="fill-none stroke-5 stroke-linecap-round stroke-line"
        d="M340 170 H480"
      />
      <circle className="stroke-4 fill-mint" cx="30" cy="70" r="7" />
      <circle className="stroke-4 fill-mint" cx="120" cy="70" r="7" />
      <circle className="stroke-4 fill-mint" cx="210" cy="70" r="7" />
      <circle className="stroke-4 fill-mint" cx="230" cy="120" r="7" />
      <circle
        className="fill-night stroke-4 stroke-signal animate-station-pulse"
        cx="340"
        cy="170"
        r="7"
      />
      <circle
        className="fill-night stroke-4 stroke-line"
        cx="480"
        cy="170"
        r="7"
      />
      <text className="fill-mint text-[11px] font-mono" x="16" y="98">
        HTML
      </text>
      <text className="fill-mint text-[11px] font-mono" x="108" y="98">
        CSS
      </text>
      <text className="fill-mint text-[11px] font-mono" x="202" y="98">
        JS
      </text>
      <text className="fill-mint text-[11px] font-mono" x="252" y="124">
        TS
      </text>
      <text className="fill-signal text-[11px] font-mono" x="308" y="198">
        React ← ты
      </text>
      <text x="466" y="198" className="font-mono text-[11px] fill-mist-soft">
        Next
      </text>
      <circle
        className="fill-[#BFE0FF] drop-shadow-[0_0_6px_rgba(77,163,255,0.9)]"
        r="4.5"
      >
        <animateMotion
          dur="9s"
          repeatCount="indefinite"
          path="M30 70 H210 Q230 70 230 90 V150 Q230 170 250 170 H340"
          calcMode="linear"
          keyPoints="0;1;1"
          keyTimes="0;0.75;1"
        />
      </circle>
    </svg>
  );
}
