import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../api/auth-api";

import {
  clearTokens,
  getTokens,
  hasTokens,
  saveTokens,
} from "./token-storage";

import type {
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => hasTokens(),
  );

  async function login(data: LoginRequest): Promise<void> {
    const tokens = await loginRequest(data);

    saveTokens(tokens);
    setIsAuthenticated(true);
  }

  async function register(
    data: RegisterRequest,
  ): Promise<void> {
    const tokens = await registerRequest(data);

    saveTokens(tokens);
    setIsAuthenticated(true);
  }

  async function logout(): Promise<void> {
    const tokens = getTokens();

    try {
        if (tokens) {
        await logoutRequest(tokens.sessionId);
        }
    } finally {
        clearTokens();
        setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth trebuie folosit în interiorul AuthProvider.",
    );
  }

  return context;
}