'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Cart } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        ...(options.headers as Record<string, string> ?? {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || 'Request failed');
    }
    return res.json() as Promise<Cart>;
  }, [user]);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await authFetch(`${BASE}/cart`);
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  const addToCart = async (productId: number, quantity = 1) => {
    const data = await authFetch(`${BASE}/cart/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    setCart(data);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const data = await authFetch(`${BASE}/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    setCart(data);
  };

  const removeFromCart = async (productId: number) => {
    const data = await authFetch(`${BASE}/cart/items/${productId}`, {
      method: 'DELETE',
    });
    setCart(data);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount: cart?.totalItems ?? 0,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
