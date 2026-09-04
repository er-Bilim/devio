import type { UserProfile } from '@/entities/user/model/types';
import { formatDate } from '@/shared/lib/format';
import {
  Calendar02Icon,
  Train01Icon,
  Location04Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const date = formatDate(profile.created_at);

  const profileMetaDate = [
    {
      title: `в пути с ${date.month} ${date.year}`,
      icon: Calendar02Icon,
    },
    {
      title: `линия`,
      icon: Train01Icon,
    },
    {
      title: `станция`,
      icon: Location04Icon,
    },
  ];

  return (
    <header className="flex items-start gap-7 pt-14 pb-1.5 flex-wrap relative z-20">
      <div className="w-30 h-30 rounded-full shrink-0 overflow-hidden relative border-2 border-mint">
        <Image
          src={'/avatars/avatar-soft-3-halo.jpg'}
          alt={`Аватар ${profile.username}`}
          fill
          className="rounded-full"
        />
      </div>
      <div className="pt-1.5">
        <h1 className="font-display font-semibold text-[clamp(25px,3.4vw,34px)] tracking-[-.6px] leading-[1.12] text-mist">
          {profile.display_name}
        </h1>
        <p className="font-mono text-mint text-[14px] mt-1">
          @{profile.username}
        </p>
        <div className="flex items-center gap-3.5 mt-3.5 flex-wrap font-mono text-[12px] text-mist-soft">
          {profileMetaDate.map((meta) => {
            const icon = meta.icon;

            return (
              <div
                className="flex flex-row gap-2 items-center"
                key={meta.title}
              >
                <HugeiconsIcon
                  icon={icon}
                  strokeWidth={2}
                  className="hidden lg:block size-3.5 text-mist-soft"
                />
                <p>{meta.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
