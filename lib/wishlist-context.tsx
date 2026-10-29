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
import { getStorageItem, setStorageItem } from '@/lib/storage';

interface WishlistContextValue {
  ids: string[];
  count: number;
  isHydrated: boolean;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const WISH_KEY = 'velora_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIds(getStorageItem<string[]>(WISH_KEY, []));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) setStorageItem(WISH_KEY, ids);
  }, [ids, isHydrated]);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, count: ids.length, isHydrated, toggle, has, remove, clear }),
    [ids, isHydrated, toggle, has, remove, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
