import 'server-only';
import { cookies } from 'next/headers';

const BASE_URL = process.env.API_URL_INTERNAL ?? 'http://localhost:8000';

export const serverFetch = async <T>(path: string): Promise<T | null> => {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: 'no-store',
  });

  if (res.status === 401 || res.status === 404) return null;

  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json() as Promise<T>;
};

export const serverFetchPublic = async <T>(
  path: string,
  { revalidate = 3600, tags = [] as string[] } = {},
): Promise<T | null> => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate, tags },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
    return res.json() as Promise<T>;
  } catch (error) {
    console.warn(error);
    return null;
  }
};
