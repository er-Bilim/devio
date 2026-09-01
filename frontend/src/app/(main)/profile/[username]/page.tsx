import { getProfile } from '@/entities/user/api/server';
import { ProfileHeader } from '@/widgets/profile';

interface ProfileProps {
  params: Promise<{ username: string }>;
}

export default async function Profile({ params }: ProfileProps) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) return null;

  return (
    <div className="wrap">
      <ProfileHeader profile={profile} />
    </div>
  );
}
