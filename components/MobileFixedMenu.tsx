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
        <div className="bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-red-600/20 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-6 py-3.5 pb-safe-area-bottom">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 group ${
                  isActive ? 'text-red-500 -translate-y-0.5' : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'} transition-transform`}>
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]' : ''} 
                  />
                  {isActive && (
                     <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_6px_#dc2626]"></span>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-red-500' : 'text-gray-400'}`}>
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
