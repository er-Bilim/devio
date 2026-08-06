'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, qk } from '@/shared/api';

const completeStage = (stageId: number) =>
  api(`/stages/${stageId}/complete`, { method: 'POST' });

export const useCompleteStage = (roadmapSlug: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeStage,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.roadmap(roadmapSlug) });
      void qc.invalidateQueries({ queryKey: qk.streak });
    },
  });
};
