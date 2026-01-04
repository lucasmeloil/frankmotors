'use client';

import { useState, useEffect } from 'react';
import { Car, Tag, Users, TrendingUp, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    promotions: 0,
    activeReservations: 0, // In a real app this would come from a database table
  });

  useEffect(() => {
    fetchStats();
    
    // Welcome message logic
    const showWelcome = sessionStorage.getItem('show_welcome');
    if (showWelcome === 'true') {
      toast.success('Olá Patrão! Bem-vindo de volta.', {
        description: 'Sua central de controle futurista está pronta 🚀',
        duration: 5000,
        icon: <Sparkles className="text-yellow-400 animate-pulse" />,
        style: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
          color: '#ffffff',
          border: '1px solid #e60000',
          boxShadow: '0 0 20px rgba(230, 0, 0, 0.3)'
        }
      });
      sessionStorage.removeItem('show_welcome');
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      setStats({
        totalVehicles: data.pagination.total || 0,
        promotions: data.vehicles.filter((v: any) => v.promocao).length || 0,
        activeReservations: 12, // Dummy data for demo
      });
    } catch (e) {
      console.error(e);
    }
  };

  const widgets = [
    { label: 'Total de Veículos', value: stats.totalVehicles, icon: Car, color: 'bg-blue-500' },
    { label: 'Em Promoção', value: stats.promotions, icon: Tag, color: 'bg-red-500' },
    { label: 'Reservas Hoje', value: stats.activeReservations, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Usuários Ativos', value: 1, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="text-secondary animate-bounce" size={24} />
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Olá Patrão! Bem-vindo de volta.</h1>
          </div>
          <p className="text-gray-400 font-medium">A Frank Motors está operando em 100% da capacidade hoje. 🏎️💨</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-secondary/20 transition-all duration-700"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/5 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, idx) => {
          const Icon = widget.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`${widget.color} p-3 rounded-xl text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{widget.label}</p>
                <p className="text-2xl font-black text-primary">{widget.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-black text-primary uppercase">Atividades Recentes</h3>
            <button className="text-xs font-bold text-secondary hover:underline">Ver todas</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Novo veículo cadastrado: Toyota Corolla 2023</p>
                    <p className="text-xs text-gray-400">Há {i * 2} horas por Lucas Melo</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase">Sucesso</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="font-heading font-black text-primary uppercase">Alertas do Sistema</h3>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-2xl flex items-start space-x-3 text-red-700">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Estoque Baixo</p>
                <p className="text-xs opacity-80">Honda Civic está com apenas 1 unidade disponível.</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl flex items-start space-x-3 text-blue-700">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Atualização de Sistema</p>
                <p className="text-xs opacity-80">Nova versão do dashboard disponível. Verifique as configurações.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Metas do Mês</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Vendas</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[75%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Novos Leads</span>
                  <span>40%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[40%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
