import 'server-only';
import { cookies, headers } from 'next/headers';

const BASE_URL = process.env.API_URL_INTERNAL ?? 'http://localhost:8000';

type ServerFetchOptions = {
  cache?: RequestCache;
};

export const serverFetch = async <T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T | null> => {
  const cookieHeader = (await cookies()).toString();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...(cookieHeader && { headers: { cookie: cookieHeader } }),
    ...(options.cache && { cache: options.cache }),
  });

  if (res.status === 401 || res.status === 404) return null;

  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json() as Promise<T>;
};
