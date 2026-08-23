import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not defined');
let refreshPromise: Promise<boolean> | null = null;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const ensureRefreshed = (): Promise<boolean> => {
  refreshPromise ??= axios
    .post(`${API_URL}/auth/refresh`, null, {
      withCredentials: true,
    })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig;
    const status = error.response?.status;
    const url = config.url ?? '';

    if (
      status !== 401 ||
      url.startsWith('/auth/') ||
      config._retried ||
      !config
    ) {
      throw error;
    }

    const refreshed = await ensureRefreshed();

    if (!refreshed) throw error;

    config._retried = true;
    return api(config);
  },
);
