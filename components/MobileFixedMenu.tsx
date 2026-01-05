'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Tag, MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileFixedMenu() {
  const pathname = usePathname();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();

  // Don't show on admin pages
  if (pathname.includes('/admin')) return null;

  const menuItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Veículos', path: '/veiculos', icon: Car },
    { label: 'Ofertas', path: '/promocoes', icon: Tag },
    { label: 'Contato', path: '/contato', icon: MessageCircle },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-[9999] animate-slide-up">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] flex justify-around items-center px-2 py-4 relative overflow-hidden">
          {/* Neon Glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex flex-col items-center justify-center space-y-1 w-16 h-14 transition-all duration-300 ${
                  isActive ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full -z-10 animate-pulse"></div>
                )}
                
                <Icon 
                  size={isActive ? 24 : 22} 
                  className={`transition-colors duration-300 ${isActive ? 'text-secondary drop-shadow-[0_0_8px_rgba(230,0,0,0.5)]' : 'text-gray-300'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {isActive && (
                  <span className="absolute -bottom-2 w-1 h-1 bg-secondary rounded-full shadow-[0_0_5px_#e60000]"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
