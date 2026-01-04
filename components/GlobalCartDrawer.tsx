'use client';

import { useCart } from "@/context/CartContext";
import Cart from "./Cart";

export default function GlobalCartDrawer() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
}
