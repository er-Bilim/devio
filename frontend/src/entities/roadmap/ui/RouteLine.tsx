import type { CSSProperties } from 'react';
import './RouteLine.css';
import type { Stage } from '../model/types';

export type Route = {
  title: string;
  type: 'done' | 'now' | 'soon';
};

interface RouteLineProps {
  routes: Stage[];
}

export function RouteLine({ routes }: RouteLineProps) {
  return (
    <ol
      className="route"
      style={
        {
          '--n': routes.length,
        } as CSSProperties
      }
    >
      {routes.map((route) => (
        <li
          key={route.title}
          className="relative flex flex-col items-center gap-3 min-w-0"
        >
          <i className="w-3.5 h-3.5 rounded-full bg-surface shadow-[inset_0_0_0_3px_var(--rose)]" />
          <span className="text-[12px] text-faint whitespace-pre-wrap text-center">
            {route.title}
          </span>
        </li>
      ))}
    </ol>
  );
}
