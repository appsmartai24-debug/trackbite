"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/config";
import { getUserRole } from "@/lib/firebase/auth";
import { AuthUser, UserRole } from "@/types";

interface AuthContextValue {
  currentUser: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function buildAuthUser(user: User): Promise<AuthUser> {
  const role = await getUserRole(user.uid);
  return {
    uid: user.uid,
    email: user.email,
    role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const authUser = await buildAuthUser(user);
      setCurrentUser(authUser);
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const authUser = await buildAuthUser(user);
          setCurrentUser(authUser);
        } catch {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: null,
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      role: currentUser?.role ?? null,
      loading,
      isAuthenticated: Boolean(currentUser),
      refreshUser,
    }),
    [currentUser, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
