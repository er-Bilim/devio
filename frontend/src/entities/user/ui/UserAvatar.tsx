import Image from 'next/image';
import { getAvatarKey } from '../lib/getAvatarKey';

interface UserAvatarProps {
  username: string;
  size?: number;
}

export function UserAvatar({ username, size = 40 }: UserAvatarProps) {
  const key: string = getAvatarKey(username);

  return (
    <Image
      src={`/avatars/${key}.svg`}
      width={size}
      height={size}
      alt={`Avatar of ${username}`}
      unoptimized
      className="shrink-0 rounded-[38%]"
    />
  );
}
