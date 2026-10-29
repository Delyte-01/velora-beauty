'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, Product } from '@/types';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { makeLineKey } from '@/lib/cart';

interface CartContextValue {
  items: CartItem[];
  count: number;
  isHydrated: boolean;
  addToCart: (
    product: Product,
    quantity: number,
    selectedVariants: Record<string, string>
  ) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = 'velora_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(getStorageItem<CartItem[]>(CART_KEY, []));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) setStorageItem(CART_KEY, items);
  }, [items, isHydrated]);

  const addToCart = useCallback(
    (product: Product, quantity: number, selectedVariants: Record<string, string>) => {
      const lineKey = makeLineKey(product.id, selectedVariants);
      setItems((prev) => {
        const existing = prev.find((i) => i.lineKey === lineKey);
        if (existing) {
          return prev.map((i) =>
            i.lineKey === lineKey
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: Math.min(quantity, product.stock),
            selectedVariants,
            stock: product.stock,
            lineKey,
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.lineKey === lineKey
            ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((i) => i.lineKey !== lineKey));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, count, isHydrated, addToCart, updateQuantity, removeItem, clearCart }),
    [items, count, isHydrated, addToCart, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
