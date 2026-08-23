import { Logo } from '@/src/shared/ui/logo';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Fire03Icon,
  ChampionIcon,
  UserGroup02Icon,
  DotIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { type Station, RoadmapLine } from '@/entities/roadmap/index';

interface BrandAsideProps {
  variant: 'signin' | 'signup';
}

export function BrandAside({ variant }: BrandAsideProps) {
  const isLogin = variant === 'signin';
  const isRegister = variant === 'signup';

  const loginStations: Station[] = [
    { title: 'HTML', status: 'done' },
    { title: 'CSS', status: 'done' },
    { title: 'JS', status: 'done' },
    { title: 'React', status: 'here' },
    { title: 'Next', status: 'next' },
  ];

  const guestStations: Station[] = [
    { title: 'старт', status: 'here' },
    { title: 'HTML', status: 'next' },
    { title: 'CSS', status: 'next' },
    { title: 'JS', status: 'next' },
    { title: 'React', status: 'next' },
  ];

  return (
    <aside
      className="hidden relative bg-night lg:flex flex-col justify-between py-10 px-12 border-r border-line "
      style={{
        backgroundImage: `
        radial-gradient(1000px 600px at 20% -10%, #16233F 0%, transparent 60%),
        radial-gradient(800px 500px at 90% 110%, #101B33 0%, transparent 55%)
      `,
      }}
    >
      <div className="w-full">
        <Link href="/" className="flex items-start gap-4 flex-row">
          <Logo />
          <p className="font-display font-bold text-[20px] text-mist inline-flex items-end gap-1">
            devio
            <HugeiconsIcon
              icon={DotIcon}
              strokeWidth={7}
              className="size-4 text-signal"
            />
          </p>
        </Link>
      </div>
      <div className="max-w-115 mx-auto">
        <div>
          <h1 className="font-display font-semibold text-[clamp(26px,2.6vw,36px)] tracking-[-0.5px] leading-tight mb-4 text-mist">
            {isLogin && 'Ночь – лучшее время'}
            {isRegister && 'Вся ветка –'}
            <em className="text-signal ml-3 not-italic">
              {isLogin && 'двигаться по ветке'}
              {isRegister && 'ещё впереди'}
            </em>
          </h1>
          <p className="text-mist-soft text-[15px]">
            {isLogin &&
              'Войди, чтобы вернуться на свою станцию: прогресс, стрик и следующий шаг уже ждут.'}
            {isRegister &&
              'Выбери направление, и карта начнёт загораться станция за станцией. Первая – сегодня.'}
          </p>

          <RoadmapLine stations={isLogin ? loginStations : guestStations} />
        </div>
      </div>

      <div className="flex items-center gap-4.5 text-mist-soft text-[13px] justify-center">
        <p className="inline-flex items-center gap-2 text-amber font-semibold ">
          <HugeiconsIcon
            icon={Fire03Icon}
            strokeWidth={1.8}
            className="size-4"
          />
          Твой стрик ждёт продолжения
        </p>
        <p className="inline-flex items-center gap-2 text-amber font-semibold ">
          <HugeiconsIcon
            icon={ChampionIcon}
            strokeWidth={1.8}
            className="size-4"
          />
          Стрик начинается с первого дня
        </p>

        <p className="inline-flex items-center gap-2 font-semibold">
          <HugeiconsIcon
            icon={UserGroup02Icon}
            strokeWidth={1.8}
            className="size-4"
          />
          12 400 человек уже в пути
        </p>
      </div>
    </aside>
  );
}
