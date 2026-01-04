'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';

interface CartItem {
  vehicle: Vehicle;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (vehicle: Vehicle) => void;
  removeFromCart: (vehicleId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('frank_motors_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('frank_motors_cart', JSON.stringify(items));
  }, [items]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (vehicle: Vehicle) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.vehicle.id === vehicle.id);
      if (existing) {
        setIsCartOpen(true); // Open cart if item already there
        return prev;
      }
      setIsCartOpen(true); // Open cart on add
      return [...prev, { vehicle, quantity: 1 }];
    });
  };

  const removeFromCart = (vehicleId: string) => {
    setItems((prev) => prev.filter((item) => item.vehicle.id !== vehicleId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((acc, item) => acc + Number(item.vehicle.preco), 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        totalItems, 
        totalPrice, 
        isCartOpen, 
        setIsCartOpen 
      }}
    >
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
