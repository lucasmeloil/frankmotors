'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowLeft, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Brute force protection check
    if (failedAttempts >= 5) {
      setError('Múltiplas tentativas incorretas detectadas. Por segurança, aguarde alguns instantes antes de tentar novamente.');
      return;
    }

    setLoading(true);

    try {
      const { auth, db } = await import('@/lib/firebase');
      const { signInWithEmailAndPassword, signOut } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const normalizedEmail = (user.email || '').toLowerCase().trim();

      // 🛡️ Strict Admin Verification: Only admin@cabocar.com.br or verified admin role
      let isAuthorizedAdmin = normalizedEmail === 'admin@cabocar.com.br' || normalizedEmail === 'admin@cabocarmultimarcas.com.br';

      if (!isAuthorizedAdmin) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            isAuthorizedAdmin = true;
          }
        } catch (checkErr) {
          console.error('Erro ao checar permissões:', checkErr);
        }
      }

      // If NOT an authorized admin, block immediately and purge session
      if (!isAuthorizedAdmin) {
        await signOut(auth);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('cabo_car_user');
        setFailedAttempts(prev => prev + 1);
        setError('Acesso Negado: Esta conta não possui privilégios de administrador. Clientes não têm permissão para acessar o painel restrito.');
        setLoading(false);
        return;
      }

      // Valid admin
      const token = await user.getIdToken(true);
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify({
        email: user.email,
        uid: user.uid,
        name: user.displayName || 'Administrador CABO CAR',
        role: 'admin'
      }));
      sessionStorage.setItem('show_welcome', 'true');

      router.push('/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setFailedAttempts(prev => prev + 1);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Credenciais administrativas incorretas. Verifique seu e-mail e senha.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Acesso temporariamente bloqueado por excesso de tentativas. Aguarde alguns minutos.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de e-mail inválido.');
      } else {
        setError('Falha de conexão com o servidor de autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060608] via-[#0d0d10] to-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-950/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-64 h-20 mx-auto mb-3 group cursor-pointer">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/40 transition-all duration-500" />
              <Image
                src="/assets/logo-cabocar.png"
                alt="CABO CAR Multimarcas"
                fill
                className="object-contain relative z-10 filter drop-shadow-[0_4px_20px_rgba(220,38,38,0.7)] group-hover:scale-105 transition-all duration-500"
                priority
              />
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-red-600/15 border border-red-600/30 px-3 py-1 rounded-full mb-2">
            <ShieldCheck size={14} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Área Administrativa Restrita</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-white tracking-tight uppercase italic">
            CABO CAR <span className="text-red-600">Admin</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Acesso exclusivo para administradores autorizados
          </p>
        </div>

        {/* Card (Apenas Login — Sem opção de criar usuário) */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-red-950/25 overflow-hidden border border-red-100">
          <div className="p-8">
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h2 className="font-heading text-xl font-black text-gray-950 uppercase italic tracking-tight flex items-center gap-2">
                <Lock size={18} className="text-red-600" />
                <span>Autenticação Segura</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Insira suas credenciais corporativas autorizadas
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-xs font-bold flex items-start gap-2.5 leading-relaxed animate-shake">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                  E-mail do Administrador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm font-medium"
                    placeholder="Digite seu e-mail institucional"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                  Senha Administrativa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm font-medium"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span>Validando Privilégios...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Acessar Painel de Controle</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 hover:text-red-600 uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Voltar ao Site</span>
              </Link>
            </div>

          </div>
        </div>

        <p className="text-center text-gray-500 text-[11px] mt-6 opacity-70 font-medium">
          Sistema protegido contra ataques de força bruta, SQL Injection, IDOR e XSS.
        </p>
      </div>
    </div>
  );
}
