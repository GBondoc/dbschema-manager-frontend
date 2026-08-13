import { apiClient } from "./api-client";

import type {
  AuthTokens,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export async function loginRequest(
  data: LoginRequest,
): Promise<AuthTokens> {
  const response = await apiClient.post<AuthTokens>(
    "/auth/login",
    data,
  );

  return response.data;
}

export async function registerRequest(
  data: RegisterRequest,
): Promise<AuthTokens> {
  const response = await apiClient.post<AuthTokens>(
    "/auth/register",
    data,
  );

  return response.data;
}

export async function logoutRequest(
  sessionId: string,
): Promise<void> {
  await apiClient.post("/auth/logout", {
    sessionId,
  });
}

export async function getCurrentUserRequest(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>("/auth/me");

  return response.data;
}