interface LogoProps {
  size?: number;
}

export function Logo({ size = 32 }: LogoProps) {
  return (
    <div className="flex items-center justify-center gap-2.5 font-display font-medium text-[18px] tracking-[-.3px]">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient
            id="devio-logo-route"
            x1="9"
            y1="41"
            x2="39"
            y2="11"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#E2B886" />
            <stop offset="1" stopColor="#E08A7E" />
          </linearGradient>
        </defs>
        <path
          d="M9 41 L9 27 L25 11 L36 11"
          stroke="url(#devio-logo-route)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="41" r="5.5" fill="#E2B886" />
        <circle cx="39" cy="11" r="6.5" stroke="#E08A7E" strokeWidth="5" />
      </svg>
      <p>
        devio <span className="text-rose ms-2">.</span>
      </p>
    </div>
  );
}
