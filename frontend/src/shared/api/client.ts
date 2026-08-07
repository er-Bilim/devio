import axios, { type AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not defined');
let refreshPromise: Promise<boolean> | null = null;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// const axiosRequest = async <T>(
//   url: string,
//   config?: AxiosRequestConfig,
// ): Promise<T> => {
//   try {
//     const { data } = await axios<T>({
//       url,
//       withCredentials: true,
//       ...config,
//     });

//     return data;
//   } catch (error) {
//     if (axios.isAxiosError<ApiError>(error)) {
//       if (error.response) {
//         const serverErrorData = error.response.data;
//         const statusCode = error.response.status;

//         throw new ApiError(statusCode, serverErrorData.detail);
//       }
//     }
//     throw error;
//   }
// };

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

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';
    const alreadyRetried = error.config?._retried;

    if (status !== 401 || url.startsWith('/auth/') || alreadyRetried) {
      throw error;
    }

    const refreshed = await ensureRefreshed();

    if (!refreshed) throw error;

    error.config._retried = true;
    return api(error.config);
  },
);

// export const api = async <T>(
//   url: string,
//   config?: AxiosRequestConfig,
// ): Promise<T> => {
//   try {
//     return await axiosRequest<T>(url, config);
//   } catch (error) {
//     const is401 = error instanceof ApiError && error.status === 401;
//     const isAuthPath = url.startsWith('/auth/');

//     if (!is401 && !isAuthPath) throw error;

//     const refreshed = await ensureRefreshed();

//     if (!refreshed) throw error;

//     return await axiosRequest<T>(url, config);
//   }
// };
