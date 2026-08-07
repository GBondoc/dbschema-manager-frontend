import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearTokens,
  getTokens,
  saveTokens,
} from "../auth/token-storage";

import type { AuthTokens } from "../types/auth";

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL nu este definit. Verifică fișierul .env.",
  );
}

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<AuthTokens> | null = null;

apiClient.interceptors.request.use((config) => {
  const tokens = getTokens();

  if (tokens?.access_token) {
    config.headers.Authorization =
      `Bearer ${tokens.access_token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const tokens = getTokens();

    if (!tokens) {
      clearTokens();
      window.location.assign("/login");

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post<AuthTokens>("/auth/refresh", {
            sessionId: tokens.sessionId,
            refresh_token: tokens.refresh_token,
          })
          .then((response) => response.data)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newTokens = await refreshPromise;

      saveTokens(newTokens);

      originalRequest.headers.Authorization =
        `Bearer ${newTokens.access_token}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearTokens();
      window.location.assign("/login");

      return Promise.reject(refreshError);
    }
  },
);