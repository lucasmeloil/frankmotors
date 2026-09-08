'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to official admin login as client login area is retired
    router.replace('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>Redirecionando para o Portal de Acesso...</span>
        </div>
      </div>
    </div>
  );
}
