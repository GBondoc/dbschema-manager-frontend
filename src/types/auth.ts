export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  sessionId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  displayedName?: string;
  email: string;
  password: string;
};