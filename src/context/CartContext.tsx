"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

import { products as catalogProducts } from "@/data/products";

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
  addToCart: (productId: string, quantity?: number, productData?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "penaameen_local_cart";

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: true,
    error: null,
  });

  const loadFromLocalStorage = useCallback((): CartItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveToLocalStorage = useCallback((items: CartItem[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        const apiItems: CartItem[] = data.items ?? [];
        if (apiItems.length > 0) {
          const { total, itemCount } = calculateTotals(apiItems);
          setState({
            items: apiItems,
            total,
            itemCount,
            isLoading: false,
            error: null,
          });
          saveToLocalStorage(apiItems);
          return;
        }
      }
    } catch {
      // Ignore network errors and fallback to local storage
    }

    // Fallback to local storage
    const localItems = loadFromLocalStorage();
    const { total, itemCount } = calculateTotals(localItems);
    setState({
      items: localItems,
      total,
      itemCount,
      isLoading: false,
      error: null,
    });
  }, [loadFromLocalStorage, saveToLocalStorage]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1, productData?: any) => {
    // 1. Optimistically find the product
    let prod = productData;
    if (!prod) {
      const matched = catalogProducts.find((p) => p.id === productId || p.slug === productId);
      if (matched) {
        prod = {
          id: matched.id,
          slug: matched.slug,
          name: matched.name,
          category: matched.category,
          price: String(matched.price),
          image: matched.image,
          stock: 50,
        };
      }
    }

    if (!prod) {
      prod = {
        id: productId,
        slug: productId,
        name: "Produk",
        category: "Umum",
        price: "0",
        image: "/images/penaameen/products/home-learning.jpg",
        stock: 50,
      };
    }

    setState((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) => item.product.id === productId || item.product.slug === prod.slug
      );
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = prev.items.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: newQty,
              subtotal: Number(item.product.price) * newQty,
            };
          }
          return item;
        });
      } else {
        const newItem: CartItem = {
          id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          quantity,
          product: {
            id: prod.id,
            slug: prod.slug,
            name: prod.name,
            category: prod.category,
            price: String(prod.price),
            image: prod.image,
            stock: prod.stock ?? 50,
          },
          subtotal: Number(prod.price) * quantity,
        };
        updatedItems = [...prev.items, newItem];
      }

      const { total, itemCount } = calculateTotals(updatedItems);
      saveToLocalStorage(updatedItems);

      return {
        ...prev,
        items: updatedItems,
        total,
        itemCount,
        isLoading: false,
        error: null,
      };
    });

    // 2. Try sync to API if available
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
    } catch {
      // Ignored for offline/guest
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setState((prev) => {
      const updatedItems = prev.items
        .map((item) => {
          if (item.product.id === productId || item.product.slug === productId) {
            return {
              ...item,
              quantity,
              subtotal: Number(item.product.price) * quantity,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const { total, itemCount } = calculateTotals(updatedItems);
      saveToLocalStorage(updatedItems);

      return {
        ...prev,
        items: updatedItems,
        total,
        itemCount,
      };
    });

    try {
      await fetch(`/api/cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
    } catch {
      // Local updated
    }
  };

  const removeFromCart = async (productId: string) => {
    setState((prev) => {
      const updatedItems = prev.items.filter(
        (item) => item.product.id !== productId && item.product.slug !== productId
      );
      const { total, itemCount } = calculateTotals(updatedItems);
      saveToLocalStorage(updatedItems);

      return {
        ...prev,
        items: updatedItems,
        total,
        itemCount,
      };
    });

    try {
      await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
      });
    } catch {
      // Local updated
    }
  };

  const clearCart = useCallback(() => {
    setState({ items: [], total: 0, itemCount: 0, isLoading: false, error: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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