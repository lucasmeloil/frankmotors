'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowLeft, User, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Mode = 'login' | 'register';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { auth } = await import('@/lib/firebase');
      const { signInWithEmailAndPassword } = await import('firebase/auth');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify({
        email: user.email,
        uid: user.uid,
        name: user.displayName || name || 'Admin'
      }));
      sessionStorage.setItem('show_welcome', 'true');

      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos. Verifique seus dados.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido. Verifique o formato.');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Digite seu nome completo.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);

    try {
      const { auth, db } = await import('@/lib/firebase');
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Save user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        role: 'admin',
        createdAt: serverTimestamp(),
      });

      const token = await user.getIdToken();
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify({
        email: user.email,
        uid: user.uid,
        name: name
      }));
      sessionStorage.setItem('show_welcome', 'true');

      setSuccess('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Faça login ou use outro e-mail.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido. Verifique o formato.');
      } else if (err.code === 'auth/weak-password') {
        setError('Senha fraca. Use pelo menos 6 caracteres.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-gray-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-64 h-24 mx-auto mb-4 group/loginlogo cursor-pointer">
            <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-2xl group-hover/loginlogo:bg-sky-400/40 transition-all duration-500" />
            <Image
              src="/assets/logo-babymotos-transparent.png"
              alt="Baby Motos"
              fill
              className="object-contain relative z-10 filter drop-shadow-[0_4px_20px_rgba(0,166,255,0.7)] group-hover/loginlogo:scale-105 group-hover/loginlogo:drop-shadow-[0_0_30px_rgba(0,166,255,1)] transition-all duration-500"
            />
          </div>
          <h1 className="font-heading text-3xl font-black text-white tracking-tight uppercase italic">
            Baby <span className="text-sky-400">Motos</span>
          </h1>
          <p className="text-sky-300 text-xs font-bold uppercase tracking-widest mt-1">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-sky-500/10 overflow-hidden border border-sky-100">
          {/* Tab switcher */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-inner'
                  : 'bg-gray-50 text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck size={15} />
                Entrar
              </span>
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-inner'
                  : 'bg-gray-50 text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={15} />
                Criar Conta
              </span>
            </button>
          </div>

          <div className="p-8">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {success}
              </div>
            )}

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-5">
              {/* Name (register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all outline-none text-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all outline-none text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sky-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={18} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all outline-none text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sky-500 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                  </>
                ) : (
                  mode === 'login' ? 'Entrar no Painel' : 'Criar Minha Conta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center pt-5 border-t border-gray-100">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-sky-500 uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={15} />
                <span>Voltar ao Site</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 opacity-50">
          Baby Motos · Painel Seguro · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
