'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { plantId: string; variantId: string; quantity: number };
type CartContextValue = {
  city: string;
  items: CartItem[];
  itemCount: number;
  setCity: (city: string) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (plantId: string, variantId: string, quantity: number) => void;
  removeItem: (plantId: string, variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'sivorment_guest_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState('noida');
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { city?: string; items?: CartItem[] };
      queueMicrotask(() => {
        if (saved.city) setCityState(saved.city);
        if (Array.isArray(saved.items)) setItems(saved.items);
        setHydrated(true);
      });
    } catch { queueMicrotask(() => setHydrated(true)); }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ city, items }));
  }, [city, hydrated, items]);

  const setCity = useCallback((nextCity: string) => setCityState(nextCity), []);
  const addItem = useCallback((next: CartItem) => setItems((current) => {
    const existing = current.find((item) => item.plantId === next.plantId && item.variantId === next.variantId);
    if (!existing) return [...current, next];
    return current.map((item) => item === existing ? { ...item, quantity: Math.min(20, item.quantity + next.quantity) } : item);
  }), []);
  const updateQuantity = useCallback((plantId: string, variantId: string, quantity: number) => setItems((current) => current.map((item) => item.plantId === plantId && item.variantId === variantId ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) } : item)), []);
  const removeItem = useCallback((plantId: string, variantId: string) => setItems((current) => current.filter((item) => item.plantId !== plantId || item.variantId !== variantId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ city, items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), setCity, addItem, updateQuantity, removeItem, clear }), [addItem, city, clear, items, removeItem, setCity, updateQuantity]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
