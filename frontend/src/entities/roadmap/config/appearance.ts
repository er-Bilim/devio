import {
  Infinity02Icon,
  Layout01Icon,
  ServerStack03Icon,
  MobileProgramming02Icon,
  VisualStudioCodeIcon,
} from '@hugeicons/core-free-icons';
import type { IconType } from '@/shared/types/icon';

interface RoadmapConfig {
  [key: string]: {
    icon: IconType;
    color?: {
      tint: string;
      text: string;
      bg: string;
      border: string;
    };
  };
}

export const ROADMAP_CONFIG: RoadmapConfig = {
  frontend: {
    icon: Layout01Icon,
    color: {
      tint: 'bg-[radial-gradient(420px_220px_at_100%_0%,rgba(224,138,126,.16),transparent_70%)]',
      text: 'text-rose',
      bg: 'bg-rose',
      border: 'border-rose',
    },
  },
  backend: {
    icon: ServerStack03Icon,
    color: {
      tint: 'bg-[radial-gradient(420px_220px_at_100%_0%,rgba(152,167,198,.16),transparent_70%)]',
      text: 'text-dusk',
      bg: 'bg-dusk',
      border: 'border-dusk',
    },
  },
  devops: {
    icon: Infinity02Icon,
  },
  mobile: {
    icon: MobileProgramming02Icon,
  },
};

export const DEFAULT_ROADMAP_ICON: IconType = VisualStudioCodeIcon;
