'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Smartphone, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();

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
    { name: 'Quem Somos', href: '/quem-somos' },
    { name: 'Veículos', href: '/veiculos' },
    { name: 'Contato', href: '/contato' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
        <nav className="w-full">
          <div className="glass-nav px-4 lg:px-10 py-3.5 flex items-center justify-between border-b border-red-600/20 shadow-2xl group bg-[#0a0a0c]/95">
            {/* Logo */}
            <Link href="/" className="relative flex items-center space-x-3 group/logo">
              <div className="relative h-12 w-52 sm:w-64 transition-all duration-500 group-hover/logo:scale-105">
                <Image
                  src="/assets/logo-cabocar.png"
                  alt="Cabo Car Multimarcas"
                  fill
                  sizes="(max-width: 768px) 208px, 256px"
                  className="object-contain object-left filter drop-shadow-[0_2px_12px_rgba(220,38,38,0.4)] group-hover/logo:drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all duration-500"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all group/link ${
                    isActive(link.href) ? 'text-red-500' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-6 right-6 h-0.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
                  )}
                  <span className="absolute inset-0 bg-red-600/10 rounded-2xl opacity-0 group-hover/link:opacity-100 transition-opacity -z-0 scale-90 group-hover/link:scale-100 transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3.5 text-gray-200 hover:text-white hover:bg-white/10 rounded-[1.2rem] transition-all group border border-white/5"
                title="Minha Reserva"
              >
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform text-gray-200" />
                {totalItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0a0c] shadow-lg shadow-red-600/50 animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-[1.2rem] transition-all shadow-md shadow-red-600/30 text-xs font-black uppercase tracking-wider"
                  title="Painel Administrativo"
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              )}


              {/* Mobile Menu Toggle */}
              <button
                className={`p-3.5 ${isOpen ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'} rounded-[1.2rem] hover:scale-105 active:scale-95 transition-all md:hidden shadow-md border border-white/10`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[110] md:hidden transition-all duration-700 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Backdrop */}
        <div 
          className="absolute inset-0 bg-black/85 backdrop-blur-3xl transition-all duration-1000" 
          onClick={() => setIsOpen(false)}
        ></div>
        
        {/* Gradient Orbs for effect */}
        <div className={`absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-red-600/20 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[40vh] h-[40vh] bg-red-950/40 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 delay-100 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>

        <div 
          className={`absolute right-0 top-0 bottom-0 w-full sm:w-[85%] bg-[#0e0e11] border-l border-red-600/20 shadow-2xl transition-transform duration-500 cubic-bezier(.17,.67,.21,1) flex flex-col overflow-hidden backdrop-blur-xl ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/10 relative z-10">
            <div className="relative h-11 w-52">
              <Image
                src="/assets/logo-cabocar.png"
                alt="Cabo Car Multimarcas"
                fill
                className="object-contain object-left filter drop-shadow-[0_0_12px_rgba(220,38,38,0.7)]"
              />
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
                className={`group block py-2 text-4xl sm:text-5xl font-black uppercase italic tracking-tighter transition-all duration-500 transform ${
                  isOpen ? 'translate-x-0 opacity-100 ml-0' : 'translate-x-20 opacity-0'
                } ${
                  isActive(link.href) ? 'text-red-500 ml-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'text-white/60 hover:text-white hover:ml-4'
                }`}
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : '0ms' }}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative">
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[0_0_15px_#dc2626] animate-pulse"></span>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-8 bg-black/40 border-t border-white/5 space-y-6 relative z-10">
            <div className="flex flex-col gap-3">
              <a 
                href="https://wa.me/55799999960149" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-red-600/20 text-white rounded-2xl border border-white/5 transition-all group w-full"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Smartphone size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/40">Fale com Nossos Consultores</span>
                    <span className="font-bold text-sm truncate">WhatsApp Oficial Cabo Car</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">→</span>
              </a>

              {isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-4 bg-red-600/20 hover:bg-red-600/30 text-white rounded-2xl border border-red-600/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-red-400">Painel Restrito</span>
                    <span className="font-bold text-xs truncate">Administração</span>
                  </div>
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
