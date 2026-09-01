import type { UserPublic } from '@/entities/user';
import Image from 'next/image';

interface ProfileHeaderProps {
  profile: UserPublic;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="flex items-start gap-7 pt-14 pb-1.5 flex-wrap relative z-20">
      <div className="w-40 h-40 rounded-full shrink-0 overflow-hidden relative border-2 border-mint">
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
      </div>
    </header>
  );
}
