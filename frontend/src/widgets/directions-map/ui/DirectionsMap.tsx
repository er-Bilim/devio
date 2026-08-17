'use client';

import { RoadmapHubCard, StationChip, type Roadmap } from '@/entities/roadmap';
import { MapThreads } from './MapThreads';
import { configHubRoadmap, type HubConfig } from '../model/layout';
import { useState } from 'react';

interface RoadmapsProps {
  roadmaps: Roadmap[] | null;
}

export function DirectionsMap({ roadmaps }: RoadmapsProps) {
  const [active, setActive] = useState<string | null>(null);
  const isDimmed = (slug: string) => active !== null && active !== slug;

  if (!roadmaps || roadmaps.length === 0) return null;

  const lines = roadmaps
    .map((roadmap) => ({
      roadmap,
      config: configHubRoadmap[roadmap.slug] || null,
      stages: [...roadmap.stages].sort((a, b) => a.position - b.position),
      isActive: active === roadmap.slug,
    }))
    .filter((line): line is typeof line & { config: HubConfig } =>
      Boolean(line.config),
    );

  return (
    <>
      {lines.map(({ roadmap, config, stages, isActive }) => (
        <div
          key={roadmap.id}
          data-active={isActive || undefined}
          onMouseEnter={() => setActive(roadmap.slug)}
          onMouseLeave={() => setActive(null)}
          className={`transition-opacity duration-300 ${isDimmed(roadmap.slug) ? 'opacity-30' : ''}`}
        >
          <RoadmapHubCard roadmap={roadmap} />
          {stages.map((stage, index) => (
            <div key={stage.id} data-active={isActive || undefined}>
              <StationChip
                key={stage.id}
                roadmap={roadmap}
                stage={stage}
                config={config}
                position={index}
              />
            </div>
          ))}
        </div>
      ))}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1160 770"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {lines.map(({ roadmap, config, stages, isActive }) => (
          <g
            key={roadmap.id}
            data-active={isActive || undefined}
            className={`transition-opacity duration-300 ${isDimmed(roadmap.slug) ? 'opacity-30' : ''}`}
            style={
              { '--thread-color': config.hub.color } as React.CSSProperties
            }
          >
            {stages.map((stage, index) => (
              <MapThreads
                key={stage.id}
                roadmap={roadmap}
                config={config}
                position={index}
              />
            ))}
          </g>
        ))}
      </svg>
    </>
  );
}
