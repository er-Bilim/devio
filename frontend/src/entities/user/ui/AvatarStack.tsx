import { UserAvatar } from './UserAvatar';

interface AvatarStackProps {
  usernames: string[];
  size: number;
}

export function AvatarStack({ usernames, size }: AvatarStackProps) {
  return (
    <>
      {usernames.map((username) => (
        <UserAvatar key={username} username={username} size={size} />
      ))}
    </>
  );
}
