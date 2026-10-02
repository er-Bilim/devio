import type { CSSProperties } from 'react';
import './RouteLine.css';
import type { Roadmap } from '../model/types';
import { ROADMAP_CONFIG } from '../config/appearance';

export type Route = {
  title: string;
  type: 'done' | 'now' | 'soon';
};

interface RouteLineProps {
  roadmap: Roadmap;
}

export function RouteLine({ roadmap }: RouteLineProps) {
  const routes = roadmap.stages;
  const config = ROADMAP_CONFIG[roadmap.slug];

  return (
    <ol
      className="route"
      style={
        {
          '--n': routes.length,
          '--line-route': config?.color?.border ?? 'rose',
        } as CSSProperties
      }
    >
      {routes.map((route) => (
        <li
          key={route.title}
          className="relative flex flex-col items-center gap-3 min-w-0"
        >
          <i
            className={`w-3.5 h-3.5 rounded-full bg-surface border-3 ${config?.color?.border}`}
          />
          <span className="text-[12px] text-faint whitespace-pre-wrap text-center">
            {route.title}
          </span>
        </li>
      ))}
    </ol>
  );
}
