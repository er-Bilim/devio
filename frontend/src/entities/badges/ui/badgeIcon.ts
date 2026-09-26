import {
  type Award04Icon,
  Award03Icon,
  ServerStack03Icon,
  ReactIcon,
  FlameIcon,
  FootprintsIcon,
} from '@hugeicons/core-free-icons';

export const BADGE_ICONS: Record<string, typeof Award04Icon> = {
  trophy: Award03Icon,
  server: ServerStack03Icon,
  layout: ReactIcon,
  flame: FlameIcon,
  footprints: FootprintsIcon,
};

export const DEFAULT_ICON = Award03Icon;
