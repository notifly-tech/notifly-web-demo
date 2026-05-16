"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { findProduct, type Product } from "./products";
import { createCartAddedEvent } from "./events";
import { trackStorefrontEvent } from "./notifly-client";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "notif:cart:v1";

const CartContext = createContext<CartContextValue | null>(null);

export function calculateCartSubtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => {
    const product = findProduct(line.productId);
    if (!product) return total;
    return total + product.price * line.quantity;
  }, 0);
}

export function upsertCartLine(lines: CartLine[], product: Product, quantity: number): CartLine[] {
  const existing = lines.find((line) => line.productId === product.id);

  return existing
    ? lines.map((line) =>
        line.productId === product.id
          ? { ...line, quantity: line.quantity + quantity }
          : line
      )
    : [...lines, { productId: product.id, quantity }];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          // drop unknown product ids
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLines(parsed.filter((line) => findProduct(line.productId)));
        }
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines, hydrated]);

  const itemCount = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines]);
  const subtotal = useMemo(() => calculateCartSubtotal(lines), [lines]);

  const add = useCallback(async (product: Product, quantity = 1) => {
    const next = upsertCartLine(lines, product, quantity);
    const nextSubtotal = calculateCartSubtotal(next);

    setLines(next);
    try {
      await trackStorefrontEvent(
        createCartAddedEvent({ product, quantity, cartValue: nextSubtotal })
      );
    } catch {
      // SDK not ready yet — silently ignore in real-store flow
    }
  }, [lines]);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.productId !== productId)
        : current.map((line) =>
            line.productId === productId ? { ...line, quantity } : line
          )
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({ lines, itemCount, subtotal, add, setQuantity, remove, clear, hydrated }),
    [lines, itemCount, subtotal, add, setQuantity, remove, clear, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
