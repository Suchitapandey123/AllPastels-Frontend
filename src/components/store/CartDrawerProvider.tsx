"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * CartDrawerProvider — owns nothing but the bag panel's open flag.
 *
 * Deliberately separate from <StoreProvider>. The store is commerce *data*
 * (the lines, their quantities, the persisted cart); this is a piece of UI
 * state — "is the panel showing?". Keeping the two apart is what lets the
 * drawer be purely presentational over the existing store, with no second
 * copy of the cart state anywhere in the app.
 *
 * Exposing `openCart` also means any surface — the navbar today, an
 * "open bag" confirmation on the product page tomorrow — can raise the panel
 * without knowing anything about how it renders.
 */

interface CartDrawerValue {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartDrawerContext = createContext<CartDrawerValue | null>(null);

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => setOpen((current) => !current), []);

  const value = useMemo<CartDrawerValue>(
    () => ({ open, openCart, closeCart, toggleCart }),
    [open, openCart, closeCart, toggleCart],
  );

  return <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>;
}

export function useCartDrawer(): CartDrawerValue {
  const context = useContext(CartDrawerContext);
  if (!context) {
    throw new Error("useCartDrawer must be used within a <CartDrawerProvider>");
  }
  return context;
}