'use client';

import { useQuery } from '@tanstack/react-query';
import { qk } from '@/shared/api';
import { getRoadmap, getRoadmaps } from './endpoints';

export const useRoadmaps = () =>
  useQuery({ queryKey: qk.roadmaps, queryFn: getRoadmaps });

export const useRoadmap = (slug: string) =>
  useQuery({ queryKey: qk.roadmap(slug), queryFn: () => getRoadmap(slug) });
