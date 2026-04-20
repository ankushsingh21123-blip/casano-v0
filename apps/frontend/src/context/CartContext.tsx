"use client";
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, removeAll?: boolean) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('casano_cart_cache', []);

  // Items are now automatically persisted and loaded by useLocalStorage


  const addItem = React.useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, [setItems]);

  const removeItem = React.useCallback((id: string, removeAll = false) => {
    setItems(prev => {
      const existing = prev.find(item => id === item.id);
      if (!existing) return prev;
      
      if (removeAll || existing.quantity === 1) {
        return prev.filter(item => item.id !== id);
      }
      
      return prev.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  }, [setItems]);

  const clearCart = React.useCallback(() => setItems([]), [setItems]);

  const cartTotal = useMemo(() => items.reduce((total, item) => total + (item.price * item.quantity), 0), [items]);
  const cartCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
