'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ email, password, role: 'admin' })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Usuário Admin criado com sucesso!' });
        setEmail('');
        setPassword('');
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao criar usuário' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Deseja realmente excluir este administrador?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      alert('Erro ao excluir');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Create User Form */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6 sticky top-24">
            <div className="flex items-center space-x-2 text-primary">
              <UserPlus size={20} />
              <h3 className="font-heading font-black uppercase tracking-widest text-sm">Novo Admin</h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-300" size={16} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl text-sm transition-all"
                    placeholder="lucas@nexus.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Senha</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-gray-300" size={16} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary rounded-xl text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary hover:bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg"
              >
                CRIAR ADMINISTRADOR
              </button>
            </form>

            {message.text && (
              <div className={`p-4 rounded-xl flex items-start space-x-2 text-xs font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-heading font-black uppercase tracking-widest text-sm text-primary">Usuários Cadastrados</h3>
              <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-400 border border-gray-100">{users.length} TOTAL</span>
            </div>

            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Carregando usuários...</div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-gray-400">Nenhum usuário encontrado.</div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-primary text-xs uppercase">
                        {user.email.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-50 text-secondary border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                            {user.role}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    {user.email !== 'lucasmelo@nexus.com' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
