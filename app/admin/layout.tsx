'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Car, Tag, Users, LogOut, Menu, X, Settings, Image as ImageIcon, Globe } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && !pathname.includes('/login')) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (pathname.includes('/login')) return <>{children}</>;
  if (!isAuthenticated) return null;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Veículos', icon: Car, path: '/admin/veiculos' },
    { label: 'Usuários', icon: Users, path: '/admin/usuarios' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-primary text-white transition-all duration-500 ease-in-out flex flex-col shadow-2xl
          ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 md:w-24 -translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 h-20 flex items-center justify-between border-b border-white/5">
          <Link href="/admin" className={`flex items-center space-x-3 transition-opacity duration-300 ${!isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'}`}>
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="font-heading font-black text-xl tracking-tighter whitespace-nowrap">
              FRANK <span className="text-secondary">ADMIN</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2 hover:bg-white/10 rounded-xl transition-all ${!isSidebarOpen ? 'mx-auto' : ''}`}
            title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isSidebarOpen ? <X size={22} className="text-gray-400 hover:text-white" /> : <Menu size={22} className="text-secondary" />}
          </button>
        </div>

        <nav className="flex-1 py-10 px-4">
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center p-4 rounded-2xl transition-all group ${
                      isActive 
                        ? 'bg-secondary text-white shadow-lg shadow-red-900/20' 
                        : 'hover:bg-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    <Icon size={24} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                    <span className={`ml-4 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
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
            onClick={() => {
              localStorage.removeItem('admin_token');
              router.push('/admin/login');
            }}
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
      <main className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'} ml-0`}>
        <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm">
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
              <span className="text-xs font-black text-primary uppercase">Frank</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Administrador</span>
            </div>
            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-red-100">
              FK
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
