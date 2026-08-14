'use client';
import { useRef } from 'react';
import { useAuth } from '../model/store';
import type { UserPublic } from '../model/types';

interface AuthHydratorProps {
  user: UserPublic | null;
}

export function AuthHydrator({ user }: AuthHydratorProps) {
  const hydrated = useRef(false);

  if (!hydrated.current) {
    useAuth.setState({
      user,
      status: user ? 'authed' : 'guest',
    });
    hydrated.current = true;
  }

  return null;
}
