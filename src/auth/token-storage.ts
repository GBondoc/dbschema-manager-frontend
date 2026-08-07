import type { AuthTokens } from "../types/auth";

const STORAGE_KEY = "dbschema_auth";

export function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function getTokens(): AuthTokens | null {
  const value = localStorage.getItem(STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthTokens;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasTokens(): boolean {
    return getTokens() !== null;
}
