import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CircleIcon,
  TradeUpIcon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import type React from 'react';
import type { Roadmap } from '../model/types';

interface RoadmapHubCardProps {
  roadmaps: Roadmap[];
}

export function RoadmapHubCard({ roadmaps }: RoadmapHubCardProps) {
  return (
    <>
      {roadmaps &&
        roadmaps.map((roadmap) => (
          <Link
            href="/"
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 animate-drift"
            // style={
            //   {
            //     left: '100%',
            //     top: '40%',
            //     '--dur': '9.5s',
            //   } as React.CSSProperties
            // }
          >
            <div
              className="w-[min(372px,33vw)] pt-6.5 px-7 pb-5.5 rounded-xl border border-line backdrop-blur-[7px] shadow-[0_30px_70px_-32px_var(--mint)] duration-300
              transform
              hover:border-mint hover:scale-[1.04] hover:shadow-[0_36px_84px_-26px_var(--mint)]"
              style={{
                backgroundImage: `linear-gradient(158deg, rgba(19,28,50,.96) 0%, rgba(11,16,32,.96) 100%)`,
              }}
            >
              <div className="flex items-center gap-3.75 m-3.5">
                <p className="w-12.5 h-12.5 rounded-full grid place-items-center shrink-0 border-3 border-mint text-mint bg-night font-display font-bold text-[19px] shadow-[0_0_26px_-4px_var(--mint)]">
                  F
                </p>
                <div>
                  <h2 className="font-display font-semibold text-[24px] tracking-[-0.3px] leading-[1.16] text-mist">
                    Frontend
                  </h2>
                  <div className="flex items-center gap-3 font-mono text-[12px] text-mist-soft mt-1">
                    <span>6 станций</span>
                    <HugeiconsIcon
                      icon={CircleIcon}
                      strokeWidth={7}
                      className="size-1 text-mist-soft"
                    />
                    <span>~4 месяца </span>
                  </div>
                </div>
              </div>
              <p className="text-mist-soft text-[14.5px] mb-4">
                От первой страницы до продакшен-приложения: вёрстка, JavaScript,
                типы, React и деплой
              </p>
              <div className="flex items-center justify-between pt-3.5 border-t border-t-line">
                <div className="inline-flex items-center gap-1 font-mono text-[12px] text-amber">
                  <HugeiconsIcon
                    icon={TradeUpIcon}
                    strokeWidth={1.5}
                    className="size-5 text-amber"
                  />
                  <span>64% выбирают</span>
                </div>
                <div className="inline-flex items-center gap-1.75 font-bold text-[14.5px] text-mint ">
                  Открыть линию
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    strokeWidth={1.5}
                    className="size-5 text-mint"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
    </>
  );
}
