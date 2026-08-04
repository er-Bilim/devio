import axios, { type AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<boolean> | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
  }
}

const axiosRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const { data } = await axios<T>({
      url,
      withCredentials: true,
      ...config,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      if (error.response) {
        const serverErrorData = error.response.data;
        const statusCode = error.response.status;

        throw new ApiError(statusCode, serverErrorData.detail);
      }
    }
    throw error;
  }
};

const ensureRefreshed = (): Promise<boolean> => {
  refreshPromise ??= axios(`${API_URL}/auth/refresh`, {
    method: 'POST',
    withCredentials: true,
  })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const api = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    return await axiosRequest<T>(url, config);
  } catch (error) {
    const is401 = error instanceof ApiError && error.status === 401;
    const isAuthPath = url.startsWith('/auth/');

    if (!is401 && !isAuthPath) throw error;

    const refreshed = await ensureRefreshed();

    if (!refreshed) throw error;

    return await axiosRequest<T>(url, config);
  }
};
