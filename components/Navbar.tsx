'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Smartphone, MapPin, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Veículos', href: '/veiculos' },
    { name: 'Quem Somos', href: '/quem-somos' },
    { name: 'Contato', href: '/contato' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500`}>
        <nav className={`w-full`}>
          <div className={`glass-nav px-4 lg:px-10 py-4 flex items-center justify-between border-b border-white/20 shadow-premium group`}>
            {/* Logo */}
            <Link href="/" className="relative flex items-center space-x-3 group/logo">
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl leading-none text-primary uppercase italic tracking-tighter">
                  Frank <span className="text-secondary">Motors</span>
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Carros e Motos</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all hover:text-secondary group/link ${
                    isActive(link.href) ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-6 right-6 h-0.5 bg-secondary rounded-full shadow-[0_0_8px_rgba(230,0,0,0.5)]"></span>
                  )}
                  <span className="absolute inset-0 bg-gray-50 rounded-2xl opacity-0 group-hover/link:opacity-100 transition-opacity -z-0 scale-90 group-hover/link:scale-100 transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-4 text-primary hover:bg-gray-100 rounded-[1.5rem] transition-all group"
              >
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-secondary text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <Link href="/admin/login" className="hidden sm:flex p-4 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-[1.5rem] transition-all">
                <User size={22} />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className={`p-4 ${isOpen ? 'bg-secondary text-white' : 'bg-primary text-white'} rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all md:hidden`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[75%] bg-white shadow-2xl transition-transform duration-500 flex flex-col overflow-hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl text-primary uppercase italic tracking-tighter">Menu</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                style={{ animationDelay: `${i * 0.1}s` }}
                className={`block py-1 text-2xl font-black uppercase italic tracking-tighter transition-all animate-slide-up ${
                  isActive(link.href) ? 'text-secondary' : 'text-primary/60 hover:text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="p-6 bg-gray-50 space-y-6 shadow-inner">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-primary group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Smartphone size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</span>
                  <span className="font-bold text-lg">(79) 99101-5150</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-primary group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</span>
                  <span className="font-bold text-lg leading-tight">Lagarto, <br className="lg:hidden" />Sergipe</span>
                </div>
              </div>
            </div>
            <Link 
              href="/admin/login"
              className="flex items-center justify-between w-full p-6 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-black transition-all group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <User size={18} />
                <span>Painel Admin</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-secondary transition-colors">
                <Menu size={14} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
