import { FloatCard, type FloatCardSettings } from '@/shared/ui/float-card';
import { HeroMap } from './HeroMap';
import { ProgrammingFlagIcon } from '@hugeicons/core-free-icons';
import { AvatarStack } from '@/entities/user/ui/AvatarStack';

export function HeroScene() {
  const floatSettingsFirstStation: FloatCardSettings = {
    type: 'default',
    title: 'первая станция',
    description: 'HTML ~1 неделя',
    icon: ProgrammingFlagIcon,
  };

  const floatSettingsTraveler: FloatCardSettings = {
    type: 'custom',
    title: 'попутчики',
    description: 'Присоединяйтесь',
    icon: <AvatarStack usernames={['1', '2', '4', '5', '6']} size={32} />,
  };

  return (
    <div
      className="relative overflow-hidden rounded-(--r-lg) p-7 bg-[linear-gradient(160deg,var(--surface-2),var(--surface))] shadow-[var(--shadow),inset_0_0_0_1px_var(--line)] pt-21 pb-26"
      aria-hidden="true"
    >
      <div className="glow blob1" />
      <div className="glow blob2" />
      <FloatCard
        className="right-5.5 top-5.5"
        settings={floatSettingsFirstStation}
      />
      <HeroMap />
      <FloatCard
        className="left-5.5 bottom-5.5"
        settings={floatSettingsTraveler}
      />
    </div>
  );
}
