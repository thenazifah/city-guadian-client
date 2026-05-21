import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { env } from "@/config/env";
import { getAppAuth } from "@/lib/firebase";
import { tokenStorage } from "@/lib/storage";
import { authService } from "@/services/auth.service";
import { notifyError } from "@/utils/toast";

export const AuthContext = createContext(null);

async function completeBackendLogin(idToken, setAccessToken, setUser) {
  const result = await authService.exchangeFirebaseToken(idToken);
  tokenStorage.set(result.accessToken);
  setAccessToken(result.accessToken);
  setUser(result.user);
  return result.user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => tokenStorage.get());
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token) {
      setUser(null);
      setAccessToken(null);
      return null;
    }

    const profile = await authService.getMe();
    setUser(profile);
    setAccessToken(token);
    return profile;
  }, []);

  const loginWithIdToken = useCallback(
    async (idToken) => {
      return completeBackendLogin(idToken, setAccessToken, setUser);
    },
    []
  );

  const logout = useCallback(async () => {
    tokenStorage.clear();
    setUser(null);
    setAccessToken(null);

    if (env.isFirebaseConfigured()) {
      try {
        await signOut(getAppAuth());
      } catch {
        // ignore sign-out errors
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (tokenStorage.get()) {
          await refreshUser();
        }
      } catch {
        tokenStorage.clear();
        if (!cancelled) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
      notifyError("Your session has expired. Please sign in again.");
    };

    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      loginWithIdToken,
      logout,
      refreshUser,
    }),
    [user, accessToken, isLoading, loginWithIdToken, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
