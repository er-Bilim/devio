import {
  ArrowRight02Icon,
  Route02Icon,
  Settings01Icon,
  StarAward01Icon,
} from '@hugeicons/core-free-icons';

type Link = {
  href: string;
  label: string;
};

export const NAV_ITEMS: Link[] = [
  { label: 'Направления', href: '/roadmaps' },
  { label: 'Как это работает', href: '/how' },
  { label: 'Статистика', href: '/stats' },
  { label: 'Жетоны', href: '/badges' },
] as const;

export const getMenuItems = (username: string) => {
  const menuItems = [
    {
      icon: ArrowRight02Icon,
      title: 'Профиль',
      href: `/profile/${username}`,
    },
    {
      icon: Route02Icon,
      title: 'Мои линии',
      href: `/roadmaps`,
    },
    {
      icon: StarAward01Icon,
      title: 'Жетоны',
      href: '/badges',
    },
    {
      icon: Settings01Icon,
      title: 'Настройки',
      href: '/settings',
    },
  ];

  return menuItems;
};
