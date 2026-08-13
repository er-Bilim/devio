import 'server-only';

const BASE_URL = process.env.API_URL_INTERNAL ?? 'http://localhost:8000';

export const serverFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json() as Promise<T>;
};
