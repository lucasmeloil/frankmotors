'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  BarChart2, 
  ChevronRight, 
  ShieldCheck,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; initials: string } | null>(null);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes('/login')) return;

    // Use Firebase Auth state as the source of truth
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { auth, db } = await import('@/lib/firebase');
      const { onAuthStateChanged, signOut } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const normalizedEmail = (user.email || '').toLowerCase().trim();
          
          // 🛡️ Strict Authorization Check: Only admin@cabocar.com.br or verified admin role
          let isAuthorized = normalizedEmail === 'admin@cabocar.com.br' || normalizedEmail === 'admin@cabocarmultimarcas.com.br';

          if (!isAuthorized) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists() && userDoc.data().role === 'admin') {
                isAuthorized = true;
              }
            } catch (err) {
              console.error('Erro ao verificar permissão admin:', err);
            }
          }

          if (!isAuthorized) {
            toast.error('Acesso Restrito', {
              description: 'Clientes não possuem acesso ao painel administrativo. Redirecionando...'
            });
            await signOut(auth);
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            router.push('/login');
            return;
          }

          const displayName = user.displayName || user.email?.split('@')[0] || 'Admin';
          const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          setAdminUser({ name: displayName, email: user.email || '', initials });
          
          // Refresh token in localStorage
          const token = await user.getIdToken();
          localStorage.setItem('admin_token', token);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
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
    setIsMobileMenuOpen(false);
    router.push('/admin/login');
  };

  if (pathname.includes('/login')) return <>{children}</>;
  if (!isAuthenticated) return null;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', desc: 'Resumo geral e financeiro' },
    { label: 'Veículos', icon: Car, path: '/admin/veiculos', desc: 'Estoque, cadastro e vendas' },
    { label: 'Relatórios', icon: BarChart2, path: '/admin/relatorios', desc: 'Fluxo de caixa e lucros' },
    { label: 'Usuários', icon: Users, path: '/admin/usuarios', desc: 'Gestão de administradores' },
    { label: 'Segurança & Chaves', icon: KeyRound, path: '/admin/seguranca', desc: 'Chaves, URLs e proteção' },
  ];

  const currentItem = menuItems.find(i => i.path === pathname) || { label: 'Painel Admin', icon: LayoutDashboard, desc: '' };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* 📱 MOBILE TOP NAVBAR WITH DROP-DOWN MENU */}
      {/* ========================================================================= */}
      <div className="md:hidden sticky top-0 z-50 bg-[#09090b] border-b border-red-900/40 text-white shadow-xl print:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Brand / Logo */}
          <Link href="/admin" className="flex items-center space-x-2.5 group">
            <div className="relative w-36 h-9 flex-shrink-0">
              <Image 
                src="/assets/logo-cabocar.png" 
                alt="Cabo Car Multimarcas" 
                fill 
                className="object-contain filter drop-shadow-[0_2px_8px_rgba(220,38,38,0.5)]" 
                priority
              />
            </div>
            <span className="bg-red-600/20 text-red-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/30">
              Admin
            </span>
          </Link>

          {/* Right Actions: User Badge + Menu Button */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shadow-red-600/30">
              {adminUser?.initials || 'CC'}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                isMobileMenuOpen 
                  ? 'bg-red-600 text-white ring-2 ring-red-400' 
                  : 'bg-white/10 text-red-400 hover:bg-white/20 active:scale-95'
              }`}
              aria-label="Abrir menu de navegação"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={22} className="text-white animate-spin-once" />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Current Active Page Mobile Sub-bar */}
        <div className="px-4 py-1.5 bg-[#121214] border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-red-500">
            <currentItem.icon size={14} />
            <span className="font-black uppercase tracking-wider text-[11px] text-white">
              {currentItem.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {adminUser?.name || 'Administrador'}
          </span>
        </div>

        {/* 🔻 TOP-TO-BOTTOM DROPDOWN MENU PANEL 🔻 */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-x-0 top-[88px] z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 min-h-[calc(100vh-88px)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              className="bg-[#09090b] border-b border-red-600/30 shadow-2xl overflow-hidden rounded-b-3xl animate-in slide-in-from-top duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Profile Banner in Dropdown */}
              <div className="p-4 bg-gradient-to-r from-red-950/80 to-[#121214] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-red-600/40">
                    {adminUser?.initials || 'CC'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{adminUser?.name || 'Administrador'}</p>
                    <p className="text-[10px] text-red-300 truncate max-w-[200px]">{adminUser?.email || 'admin@cabocarmultimarcas.com'}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full">
                  <ShieldCheck size={12} /> Online
                </span>
              </div>

              {/* Navigation Options List */}
              <div className="p-4 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pt-1 pb-1">
                  Menu Principal
                </p>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 font-black'
                          : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-red-400'}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">{item.label}</p>
                          <p className={`text-[10px] ${isActive ? 'text-red-100' : 'text-slate-400'}`}>{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                    </Link>
                  );
                })}

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pb-1">
                    Acesso Rápido
                  </p>
                  
                  {/* Public Site Link */}
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-white/10 text-white">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider">Ver Site Público</p>
                        <p className="text-[10px] text-gray-400">Acessar vitrine pública da loja</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-red-500/20 text-red-300">
                        <LogOut size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider">Sair do Painel</p>
                        <p className="text-[10px] text-red-200/70">Desconectar sessão admin</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP SIDEBAR */}
      {/* ========================================================================= */}
      <aside 
        className={`hidden md:flex fixed inset-y-0 left-0 z-50 bg-[#09090b] text-white transition-all duration-500 ease-in-out flex-col shadow-2xl print:hidden border-r border-red-950/40
          ${isSidebarOpen ? 'w-72' : 'w-24'}
        `}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 h-24 flex items-center justify-between border-b border-white/5 bg-black/40">
          <Link href="/admin" className={`flex items-center space-x-3 transition-opacity duration-300 ${!isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'}`}>
            <div className="relative w-48 h-12 flex-shrink-0 group/side-logo">
              <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-lg group-hover/side-logo:bg-red-500/40 transition-all" />
              <Image 
                src="/assets/logo-cabocar.png" 
                alt="Cabo Car Multimarcas" 
                fill 
                className="object-contain relative z-10 filter drop-shadow-[0_2px_10px_rgba(220,38,38,0.6)] group-hover/side-logo:scale-105 transition-transform" 
                priority
              />
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer ${!isSidebarOpen ? 'mx-auto' : ''}`}
            title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isSidebarOpen ? <X size={20} className="text-gray-400 hover:text-white" /> : <Menu size={22} className="text-red-500" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 flex flex-col justify-between overflow-y-auto">
          <ul className="space-y-2.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center p-3.5 rounded-2xl transition-all group ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30' 
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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link 
            href="/"
            target="_blank"
            className={`flex items-center p-3 text-gray-300 hover:text-white hover:bg-white/10 w-full rounded-2xl transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}
            title="Ver Site Público"
          >
            <Globe size={20} className="group-hover:rotate-12 transition-transform flex-shrink-0 text-red-500" />
            <span className={`ml-3 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
              !isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
            }`}>
              Ver Site Público
            </span>
          </Link>

          <button 
            onClick={handleSignOut}
            className={`flex items-center p-3 text-red-400 hover:text-white hover:bg-red-500/20 w-full rounded-2xl transition-all group cursor-pointer ${!isSidebarOpen ? 'justify-center' : ''}`}
            title="Sair do Painel"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className={`ml-3 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
              !isSidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
            }`}>
              Sair do Painel
            </span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 📄 MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'} ml-0 print:!ml-0 print:!p-0 print:!bg-white min-w-0`}>
        
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white h-20 border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-40 shadow-sm print:hidden">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-900 cursor-pointer"
              title="Expandir/recolher menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="font-heading text-xl font-black text-gray-950 uppercase">
                {currentItem.label}
              </h2>
              {currentItem.desc && (
                <p className="text-xs text-gray-400 font-medium">{currentItem.desc}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-gray-950 uppercase">{adminUser?.name || 'Admin'}</span>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{adminUser?.email || 'Administrador'}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-red-600/20 text-sm">
              {adminUser?.initials || 'CC'}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-3 sm:p-6 md:p-8 print:!p-0 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
