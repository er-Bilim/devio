import {
  type Award04Icon,
  Award03Icon,
  ServerStack03Icon,
  ReactIcon,
  FlameIcon,
  FootprintsIcon,
  StarIcon,
  CrownIcon,
  Medal06Icon,
  EclipseIcon,
  StackStarIcon,
  Award02Icon,
  Rocket01Icon,
  CloudLightningIcon,
  Sun02Icon,
  FireIcon,
  SparklesIcon
} from '@hugeicons/core-free-icons';

export const BADGE_ICONS: Record<string, typeof Award04Icon> = {
  trophy: Award03Icon,
  server: ServerStack03Icon,
  layout: ReactIcon,
  flame: FlameIcon,
  footprints: FootprintsIcon,
  sparkles: SparklesIcon,
  star: StarIcon,
  crown: CrownIcon,
  medal: Medal06Icon,
  moon: EclipseIcon,
  layers: StackStarIcon,
  award: Award02Icon,
  rocket: Rocket01Icon,
  lightning: CloudLightningIcon,
  sun: Sun02Icon,
  fire: FireIcon,
};

export const DEFAULT_ICON = Award03Icon;
