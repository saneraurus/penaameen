"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: string;
    image: string;
    stock: number;
  };
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: true,
    error: null,
  });

  const fetchCart = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        if (response.status === 401) {
          setState({ items: [], total: 0, itemCount: 0, isLoading: false, error: null });
          return;
        }
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      setState({
        items: data.items ?? [],
        total: Number(data.total ?? 0),
        itemCount: data.itemCount ?? 0,
        isLoading: false,
        error: null,
      });
    } catch {
      setState((prev) => ({ ...prev, isLoading: false, error: "Failed to load cart" }));
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to add to cart");
      }
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to update quantity");
      }
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to remove from cart");
      }
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = () => {
    setState({ items: [], total: 0, itemCount: 0, isLoading: false, error: null });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refetch: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}