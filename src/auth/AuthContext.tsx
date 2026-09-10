import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import { ApiError } from "../api/client";

import { getCurrentUser, loginRequest, logoutRequest } from "../api/auth";

import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;

  isLoading: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);

        return;
      }

      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const currentUser = await loginRequest(email, password);

    setUser(currentUser);

    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) {
        return false;
      }

      /*
       * Super Admin always has all
       * ordinary permissions even if
       * stored permission array is empty.
       */
      if (user.role === "super_admin") {
        return true;
      }

      return user.permissions.includes(permission);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,

      isLoading,

      login,

      logout,

      refreshUser,

      hasPermission,
    }),
    [user, isLoading, login, logout, refreshUser, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
