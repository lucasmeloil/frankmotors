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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] animate-slide-up">
        <div className="glass-nav border-t border-white/20 shadow-2xl flex justify-around items-center px-2 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center space-y-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-primary text-white scale-105 shadow-lg' : 'text-gray-400 hover:text-primary active:scale-90'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'animate-pulse' : ''} />
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
        </div>
      </div>
    </>
  );
}
