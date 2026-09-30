"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import type { Product } from "@/lib/types";

/**
 * Client-side commerce state (cart + wishlist).
 *
 * This is deliberately API-shaped: every action here is the same call the
 * real backend would receive. To go live, replace the `useState` bodies with
 * mutations against the server and the rest of the app is unaffected.
 */

export interface CartLine {
  productId: string;
  size: string;
  quantity: number;
}

export interface CartLineDetail extends CartLine {
  product: Product;
  lineTotal: number;
}

interface StoreValue {
  cart: CartLineDetail[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;

  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;

  /** True once localStorage has been read on the client. */
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "allpatels.cart";
const WISHLIST_KEY = "allpatels.wishlist";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/* ---------------------------------------------------------------------------
   External store
   Wrapping localStorage in a tiny subscribe/getSnapshot pair lets the provider
   read persisted state through `useSyncExternalStore` rather than copying it
   into useState inside an effect. That removes the extra render pass, avoids
   the setState-in-effect anti-pattern, and — because the `storage` event
   fires in other tabs — keeps the cart in sync across open tabs for free.
   --------------------------------------------------------------------------- */

const EMPTY_CART: CartLine[] = [];
const EMPTY_WISHLIST: string[] = [];

function createPersistedStore<T>(key: string, fallback: T) {
  let cache: T | null = null;

  const getSnapshot = (): T => {
    // localStorage is synchronous, so caching per read batch is safe and
    // keeps getSnapshot referentially stable between writes.
    if (cache === null) cache = readStorage(key, fallback);
    return cache;
  };

  const getServerSnapshot = (): T => fallback;

  const set = (value: T) => {
    cache = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Private mode or quota exceeded — the session still works in memory.
    }
    for (const listener of listeners) listener();
  };

  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    // Another tab wrote to the same key: drop the cache and notify.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      cache = null;
      listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  return { getSnapshot, getServerSnapshot, set, subscribe };
}

const cartStore = createPersistedStore<CartLine[]>(CART_KEY, EMPTY_CART);
const wishlistStore = createPersistedStore<string[]>(WISHLIST_KEY, EMPTY_WISHLIST);

/** No-op subscription used for values that never change after mount. */
function emptySubscribe(): () => void {
  return () => {};
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const wishlist = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot,
  );

  // True once the client has taken over from the server snapshot. Consumers
  // that render from this store (e.g. a cart badge) can use it to avoid
  // showing a server count that the client will immediately correct.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const addToCart = useCallback((productId: string, size: string, quantity = 1) => {
    const current = cartStore.getSnapshot();
    const existing = current.find(
      (line) => line.productId === productId && line.size === size,
    );

    cartStore.set(
      existing
        ? current.map((line) =>
            line === existing ? { ...line, quantity: line.quantity + quantity } : line,
          )
        : [...current, { productId, size, quantity }],
    );
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    cartStore.set(
      cartStore
        .getSnapshot()
        .filter((line) => !(line.productId === productId && line.size === size)),
    );
  }, []);

  const setQuantity = useCallback((productId: string, size: string, quantity: number) => {
    const current = cartStore.getSnapshot();

    cartStore.set(
      quantity <= 0
        ? current.filter((line) => !(line.productId === productId && line.size === size))
        : current.map((line) =>
            line.productId === productId && line.size === size ? { ...line, quantity } : line,
          ),
    );
  }, []);

  const clearCart = useCallback(() => cartStore.set([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    const current = wishlistStore.getSnapshot();
    wishlistStore.set(
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );


  // Resolve stored ids against the catalogue so consumers get full products.
  const detailedCart = useMemo<CartLineDetail[]>(
    () =>
      cart
        .map((line) => {
          const product = products.find((candidate) => candidate.id === line.productId);
          if (!product) return null;
          return { ...line, product, lineTotal: product.price * line.quantity };
        })
        .filter((line): line is CartLineDetail => line !== null),
    [cart],
  );

  const value = useMemo<StoreValue>(
    () => ({
      cart: detailedCart,
      cartCount: detailedCart.reduce((total, line) => total + line.quantity, 0),
      cartSubtotal: detailedCart.reduce((total, line) => total + line.lineTotal, 0),
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      hydrated,
    }),
    [
      detailedCart,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      hydrated,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a <StoreProvider>");
  }
  return context;
}
