interface LogoProps {
  size?: number;
}

export function Logo({ size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="devio-route"
          x1="9"
          y1="41"
          x2="39"
          y2="11"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#3ECF8E" />
          <stop offset="1" stopColor="#4DA3FF" />
        </linearGradient>
        <filter id="devio-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M9 41 L9 27 L25 11 L36 11"
        stroke="url(#devio-route)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="41" r="5.5" fill="#3ECF8E" />
      <circle
        cx="39"
        cy="11"
        r="6.5"
        fill="none"
        stroke="#4DA3FF"
        strokeWidth="5"
        filter="url(#devio-glow)"
      />
    </svg>
  );
}
