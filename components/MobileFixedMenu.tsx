'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, MessageCircle, Users } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileFixedMenu() {
  const pathname = usePathname();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();

  // Don't show on admin pages
  if (pathname.includes('/admin')) return null;

  const menuItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Quem Somos', path: '/quem-somos', icon: Users },
    { label: 'Veículos', path: '/veiculos', icon: Car },
    { label: 'Contato', path: '/contato', icon: MessageCircle },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] animate-slide-up">
        {/* Full width glass container matching Navbar style */}
        <div className="glass-nav border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex justify-between items-center px-6 py-4 pb- safe-area-bottom">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 group ${
                  isActive ? 'text-secondary -translate-y-1' : 'text-gray-400 hover:text-primary'
                }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'} transition-transform`}>
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'drop-shadow-sm' : ''} 
                  />
                  {isActive && (
                     <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full shadow-sm"></span>
                  )}
                </div>
                {/* Optional: Text label can be hidden or shown depending on minimal preference. Sticking to minimal but readable per user request for "taking up space" */}
                {/* <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isActive ? 'opacity-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'} transition-all`}>
                  {item.label}
                </span> */}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
