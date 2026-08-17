'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Bike, Users, LogOut, Menu, X, Globe, BarChart2, Sparkles } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; initials: string } | null>(null);

  useEffect(() => {
    if (pathname.includes('/login')) return;

    // Use Firebase Auth state as the source of truth
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { auth } = await import('@/lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const displayName = user.displayName || user.email?.split('@')[0] || 'Admin';
          const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          setAdminUser({ name: displayName, email: user.email || '', initials });
          // Refresh token in localStorage
          const token = await user.getIdToken();
          localStorage.setItem('admin_token', token);
          setIsAuthenticated(true);
        } else {
          // No user logged in - check localStorage fallback
          const token = localStorage.getItem('admin_token');
          if (!token) {
            router.push('/admin/login');
          } else {
            setIsAuthenticated(true);
          }
        }
      });
    })();

    return () => { if (unsubscribe) unsubscribe(); };
  }, [pathname, router]);

  const handleSignOut = async () => {
    try {
      const { auth } = await import('@/lib/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (e) { /* ignore */ }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (pathname.includes('/login')) return <>{children}</>;
  if (!isAuthenticated) return null;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Veículos / Motos', icon: Bike, path: '/admin/veiculos' },
    { label: 'Relatórios', icon: BarChart2, path: '/admin/relatorios' },
    { label: 'Usuários', icon: Users, path: '/admin/usuarios' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] md:hidden transition-opacity print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-primary text-white transition-all duration-500 ease-in-out flex flex-col shadow-2xl print:hidden
          ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 md:w-24 -translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 h-24 flex items-center justify-between border-b border-white/5 bg-black/20">
          <Link href="/admin" className={`flex items-center space-x-3 transition-opacity duration-300 ${!isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'}`}>
            <div className="relative w-44 h-12 flex-shrink-0 group/side-logo">
              <div className="absolute inset-0 bg-sky-500/20 rounded-xl blur-lg group-hover/side-logo:bg-sky-400/40 transition-all" />
              <Image 
                src="/assets/logo-babymotos-transparent.png" 
                alt="Baby Motos" 
                fill 
                className="object-contain relative z-10 filter drop-shadow-[0_2px_10px_rgba(0,166,255,0.6)] group-hover/side-logo:scale-105 transition-transform" 
                priority
              />
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2 hover:bg-white/10 rounded-xl transition-all ${!isSidebarOpen ? 'mx-auto' : ''}`}
            title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isSidebarOpen ? <X size={22} className="text-gray-400 hover:text-white" /> : <Menu size={22} className="text-sky-400" />}
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col justify-between overflow-y-auto">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center p-3.5 rounded-2xl transition-all group ${
                      isActive 
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={22} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform flex-shrink-0`} />
                    <span className={`ml-3.5 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                      !isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <Link 
            href="/"
            className={`flex items-center p-4 text-emerald-400 hover:text-white hover:bg-emerald-500/20 w-full rounded-2xl transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <Globe size={22} className="group-hover:rotate-12 transition-transform" />
            <span className={`ml-4 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
              !isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
            }`}>
              Ver Site Público
            </span>
          </Link>

          <button 
            onClick={handleSignOut}
            className={`flex items-center p-4 text-red-400 hover:text-white hover:bg-red-500/20 w-full rounded-2xl transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className={`ml-4 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
              !isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
            }`}>
              Sair do Painel
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'} ml-0 print:!ml-0 print:!p-0 print:!bg-white`}>
        <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm print:hidden">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all text-primary"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-heading text-lg md:text-xl font-black text-primary uppercase truncate max-w-[150px] md:max-w-none">
              {menuItems.find(i => i.path === pathname)?.label || 'Painel Admin'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-black text-primary uppercase">{adminUser?.name || 'Admin'}</span>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-tighter">{adminUser?.email || 'Administrador'}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-sky-500/20 text-sm">
              {adminUser?.initials || 'BM'}
            </div>
          </div>
        </header>

        <div className="p-8 print:!p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
