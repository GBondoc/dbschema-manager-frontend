import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import {
  getCurrentUserRequest,
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
  CurrentUser,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

type AuthContextValue = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: PropsWithChildren) {
    const [user, setUser] = useState<CurrentUser | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(
    () => hasTokens(),
    );

    const [isLoading, setIsLoading] = useState(
    () => hasTokens(),
    );

    useEffect(() => {
    async function loadCurrentUser(): Promise<void> {
        if (!hasTokens()) {
        setIsLoading(false);
        return;
        }

        try {
        const currentUser = await getCurrentUserRequest();

        setUser(currentUser);
        setIsAuthenticated(true);
        } catch {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        } finally {
        setIsLoading(false);
        }
    }

    void loadCurrentUser();
    }, []);

  async function login(data: LoginRequest): Promise<void> {
    const tokens = await loginRequest(data);

    saveTokens(tokens);

    try {
        const currentUser = await getCurrentUserRequest();

        setUser(currentUser);
        setIsAuthenticated(true);
    } catch (error) {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);

        throw error;
    }
  }

  async function register(
    data: RegisterRequest,
    ): Promise<void> {
    const tokens = await registerRequest(data);

    saveTokens(tokens);

    try {
        const currentUser = await getCurrentUserRequest();

        setUser(currentUser);
        setIsAuthenticated(true);
    } catch (error) {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);

        throw error;
    }
  }

  async function logout(): Promise<void> {
    const tokens = getTokens();

    try {
        if (tokens) {
        await logoutRequest(tokens.sessionId);
        }
    } finally {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider
        value={{
        user,
        isAuthenticated,
        isLoading,
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