type Link = {
  href: string;
  label: string;
};

export const NAV_ITEMS: Link[] = [
  { label: 'Направления', href: '/roadmaps' },
  { label: 'Как это работает', href: '/how' },
  { label: 'Статистика', href: '/stats' },
] as const;
