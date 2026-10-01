import {
  Infinity02Icon,
  Layout01Icon,
  ServerStack03Icon,
  MobileProgramming02Icon,
  VisualStudioCodeIcon,
} from '@hugeicons/core-free-icons';
import type { IconType } from '@/shared/types/icon';

export const ROADMAP_CONFIG: Record<string, IconType> = {
  layout: Layout01Icon,
  server: ServerStack03Icon,
  infinity: Infinity02Icon,
  smartphone: MobileProgramming02Icon,
};

export const DEFAULT_ICON: IconType = VisualStudioCodeIcon;
