export const qk = {
  roadmaps: ['roadmaps'] as const,
  roadmap: (slug: string) => ['roadmaps', slug] as const,
  me: ['me'] as const,
  streak: ['me', 'streak'] as const,
};
