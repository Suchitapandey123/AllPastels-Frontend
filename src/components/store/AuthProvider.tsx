"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import {
  restoreSession,
  signInCustomer,
  signOutRequest,
} from "@/api";
import { notifySessionChange } from "@/lib/session-events";
import type { SignInResult } from "@/types/auth";

/**
 * AuthProvider — client-side session state against the real backend.
 *
 * The backend JWT lives in an HttpOnly cookie set by the `/api/auth/login`
 * Route Handler, never in localStorage — the browser only ever holds this
 * harmless profile record (`allpastels.session`), which is refreshed from
 * `GET /me` on load and dropped whenever the cookie no longer validates.
 *
 * `signIn` / `signOut` keep the API shape the forms already use, so the
 * integration swapped bodies without touching any form or layout.
 */

export interface Session {
  name: string;
  email: string;
  /** ISO timestamp — mirrors the backend profile's `createdAt`. */
  joinedAt: string;
}

const SESSION_KEY = "allpastels.session";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or quota exceeded — state still lives in memory.
  }
}

/* ---------------------------------------------------------------------------
   External store
   Same subscribe/getSnapshot shape as StoreProvider, so the session stays in
   sync across tabs via the `storage` event and never needs setState-in-effect.
   --------------------------------------------------------------------------- */

const NO_SESSION: Session | null = null;

function createSessionStore() {
  let cache: Session | null | undefined;
  const listeners = new Set<() => void>();

  const getSnapshot = (): Session | null => {
    if (cache === undefined) cache = readStorage<Session | null>(SESSION_KEY, NO_SESSION);
    return cache;
  };

  const set = (value: Session | null) => {
    cache = value;
    writeStorage(SESSION_KEY, value);
    for (const listener of listeners) listener();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== SESSION_KEY) return;
      cache = undefined;
      listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  return { subscribe, getSnapshot, set };
}

const sessionStore = createSessionStore();

interface AuthValue {
  session: Session | null;
  /** True once the session has been restored (and checked against /me). */
  hydrated: boolean;
  signIn: (input: { email: string; password: string }) => Promise<SignInResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    () => NO_SESSION,
  );
  const [hydrated, setHydrated] = useState(false);

  const applyUser = useCallback((user: {
    name: string;
    email: string;
    createdAt?: string;
  }) => {
    const existing = sessionStore.getSnapshot();
    sessionStore.set({
      name: user.name,
      email: user.email,
      joinedAt:
        user.createdAt ??
        (existing && existing.email === user.email
          ? existing.joinedAt
          : new Date().toISOString()),
    });
  }, []);

  // Restore: a stored profile is only kept if the cookie's JWT still
  // validates against backend `/me`; otherwise it is dropped. The provider
  // stays un-`hydrated` until the check resolves, so gated screens (account,
  // sign-in bounce) wait for the real answer rather than a stale guess.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = sessionStore.getSnapshot();
      if (!stored) {
        setHydrated(true);
        return;
      }
      const result = await restoreSession();
      if (cancelled) return;
      if (result.ok) {
        applyUser(result.user);
      } else {
        // Token is gone/expired server-side — clear the profile and the
        // cookie so the next visit starts clean.
        void signOutRequest();
        sessionStore.set(null);
        notifySessionChange();
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [applyUser]);

  const signIn = useCallback<AuthValue["signIn"]>(({ email, password }) =>
    signInCustomer({ email, password }).then((result) => {
      if (result.ok) {
        applyUser({ name: result.user.name, email: result.user.email });
        notifySessionChange();
      }
      return result;
    }),
  [applyUser]);

  const signOut = useCallback(() => {
    sessionStore.set(null);
    // Notify after the cookie has actually been cleared, so the cart reload
    // cannot race the logout request and resurrect the previous user's bag.
    void signOutRequest().finally(notifySessionChange);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ session, hydrated, signIn, signOut }),
    [session, hydrated, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
