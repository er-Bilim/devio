import { getProfile } from '@/entities/user/api/server';
import { ProfileBadges, ProfileHeader, TripsCalendar } from '@/widgets/profile';
import { notFound } from 'next/navigation';

interface ProfileProps {
  params: Promise<{ username: string }>;
}

export default async function Profile({ params }: ProfileProps) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) return notFound();

  return (
    <div className="wrap">
      <ProfileHeader profile={profile} />
      <TripsCalendar />
      <ProfileBadges profile={profile} />
    </div>
  );
}
