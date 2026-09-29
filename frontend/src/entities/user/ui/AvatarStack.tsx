import { UserAvatar } from './UserAvatar';

interface AvatarStackProps {
  usernames: string[];
}

export function AvatarStack({ usernames }: AvatarStackProps) {
  return (
    <>
      {usernames.map((username) => (
        <UserAvatar key={username} username={username} />
      ))}
    </>
  );
}
