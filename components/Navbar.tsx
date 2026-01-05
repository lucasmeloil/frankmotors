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

      {/* Mobile Menu Overlay - Innovative Design */}
      <div 
        className={`fixed inset-0 z-[110] md:hidden transition-all duration-700 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Backdrop with heavy blur */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-3xl transition-all duration-1000" 
          onClick={() => setIsOpen(false)}
        ></div>
        
        {/* Gradient Orbs for effect */}
        <div className={`absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-secondary/20 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[40vh] h-[40vh] bg-primary/40 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 delay-100 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>

        <div 
          className={`absolute right-0 top-0 bottom-0 w-full sm:w-[85%] bg-white/10 border-l border-white/10 shadow-2xl transition-transform duration-500 cubic-bezier(.17,.67,.21,1) flex flex-col overflow-hidden backdrop-blur-xl ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-8 flex items-center justify-between border-b border-white/5 relative z-10">
            <div className="flex flex-col">
              <span className="font-heading font-black text-3xl text-white italic tracking-tighter drop-shadow-lg">
                MENU
                <span className="text-secondary">.</span>
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 active:scale-95"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto px-8 py-12 flex flex-col justify-center space-y-2 relative z-10">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`group block py-2 text-4xl sm:text-5xl font-black uppercase italic tracking-tighter transition-all duration-500 transform ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                } ${
                  isActive(link.href) ? 'text-transparent bg-clip-text bg-gradient-to-r from-secondary to-red-500 ml-4' : 'text-white/50 hover:text-white hover:ml-4'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative">
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_#e60000]"></span>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-8 bg-black/20 border-t border-white/5 space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="https://wa.me/5579991015150" 
                target="_blank"
                className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-green-600/20 text-white rounded-2xl border border-white/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Smartphone size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-white/40">WhatsApp</span>
                  <span className="font-bold text-sm">Chamar</span>
                </div>
              </a>

              <Link 
                href="/admin/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                  <User size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-white/40">Acesso</span>
                  <span className="font-bold text-sm">Admin</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
