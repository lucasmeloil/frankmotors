'use client';

import { useState, useEffect } from 'react';
import { Bike, TrendingUp, DollarSign, Package, BarChart2, Sparkles, ArrowRight, CheckCircle, Wallet, ShieldAlert, Layers } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { getAllVehicles, getAllVendas, VendaRecord, VehicleRecord } from '@/lib/db-service';

interface DashStats {
  totalVehicles: number;
  disponiveis: number;
  vendidos: number;
  reservados: number;
  // Caixa Realizado
  receitaTotal: number;
  custoVendas: number;
  lucroTotal: number;
  margemMedia: number;
  // Estoque Atual
  custoEstoqueDisponivel: number;
  valorVendaEstoqueDisponivel: number;
  lucroProjetadoEstoque: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashStats>({
    totalVehicles: 0,
    disponiveis: 0,
    vendidos: 0,
    reservados: 0,
    receitaTotal: 0,
    custoVendas: 0,
    lucroTotal: 0,
    margemMedia: 0,
    custoEstoqueDisponivel: 0,
    valorVendaEstoqueDisponivel: 0,
    lucroProjetadoEstoque: 0
  });
  const [recentSales, setRecentSales] = useState<VendaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('admin_user');
    if (user) {
      const u = JSON.parse(user);
      setAdminName(u.name || u.email || 'Admin');
    }

    const showWelcome = sessionStorage.getItem('show_welcome');
    if (showWelcome === 'true') {
      toast.success('Bem-vindo de volta! 🚀', {
        description: 'Painel financeiro Baby Motos carregado com sucesso.',
        duration: 4000,
      });
      sessionStorage.removeItem('show_welcome');
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [vehicles, vendasList] = await Promise.all([
        getAllVehicles(true),
        getAllVendas()
      ]);

      const map = new Map<string, VendaRecord>();

      vendasList.forEach(v => {
        const key = v.vehicleId || v.id || Math.random().toString();
        map.set(key, {
          ...v,
          precoCusto: Number(v.precoCusto) || 0,
          precoVenda: Number(v.precoVenda) || 0,
          lucro: Number(v.lucro) || (Number(v.precoVenda) - Number(v.precoCusto))
        });
      });

      vehicles.filter(v => v.status === 'vendido').forEach(v => {
        const key = v.id || Math.random().toString();
        if (!map.has(key)) {
          const precoCusto = Number(v.precoCusto) || 0;
          const precoVenda = Number(v.preco) || 0;
          const lucro = precoVenda - precoCusto;
          const margemPercent = precoCusto > 0 ? (lucro / precoCusto) * 100 : 0;
          map.set(key, {
            id: `venda-${v.id}`,
            vehicleId: v.id || '',
            vehicleName: `${v.marca} ${v.modelo} ${v.ano}`,
            marca: v.marca,
            modelo: v.modelo,
            ano: v.ano,
            cor: v.cor,
            precoCusto,
            precoVenda,
            lucro,
            margemPercent: Number(margemPercent.toFixed(1)),
            compradorNome: v.compradorNome || 'Cliente',
            dataVenda: v.dataVenda || v.updated_at || new Date().toISOString(),
            created_at: v.created_at || new Date().toISOString()
          });
        }
      });

      const allVendas = Array.from(map.values());

      const motosDisponiveis = vehicles.filter(v => !v.status || v.status === 'disponivel');
      const motosVendidas = vehicles.filter(v => v.status === 'vendido');
      const motosReservadas = vehicles.filter(v => v.status === 'reservado');

      // Vendas Realizadas (Caixa)
      const receitaTotal = allVendas.reduce((acc, v) => acc + (Number(v.precoVenda) || 0), 0);
      const custoVendas = allVendas.reduce((acc, v) => acc + (Number(v.precoCusto) || 0), 0);
      const lucroTotal = allVendas.reduce((acc, v) => acc + (Number(v.lucro) || 0), 0);
      const margemMedia = custoVendas > 0 ? (lucroTotal / custoVendas) * 100 : 0;

      // Estoque Atual Disponível
      const custoEstoqueDisponivel = motosDisponiveis.reduce((acc, v) => acc + (Number(v.precoCusto) || 0), 0);
      const valorVendaEstoqueDisponivel = motosDisponiveis.reduce((acc, v) => acc + (Number(v.preco) || 0), 0);
      const lucroProjetadoEstoque = valorVendaEstoqueDisponivel - custoEstoqueDisponivel;

      setStats({
        totalVehicles: vehicles.length,
        disponiveis: motosDisponiveis.length,
        vendidos: allVendas.length,
        reservados: motosReservadas.length,
        receitaTotal,
        custoVendas,
        lucroTotal,
        margemMedia,
        custoEstoqueDisponivel,
        valorVendaEstoqueDisponivel,
        lucroProjetadoEstoque
      });

      // Últimas 5 vendas ordenadas por data
      allVendas.sort((a, b) => {
        const tA = a.dataVenda ? new Date(a.dataVenda).getTime() : 0;
        const tB = b.dataVenda ? new Date(b.dataVenda).getTime() : 0;
        return tB - tA;
      });

      setRecentSales(allVendas.slice(0, 5));

    } catch (e) {
      console.error('Erro dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (v: number) => Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const formatDate = (dateVal: any) => {
    if (!dateVal) return '—';
    try {
      const d = typeof dateVal === 'string' ? new Date(dateVal) : (dateVal.toDate ? dateVal.toDate() : new Date(dateVal));
      return d.toLocaleDateString('pt-BR');
    } catch { return '—'; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#06101e] via-[#0b192c] to-[#0f172a] text-white p-5 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-sky-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <Sparkles className="text-sky-400 animate-bounce" size={20} />
              <h1 className="text-lg sm:text-2xl font-black uppercase italic tracking-tight">
                Olá{adminName ? `, ${adminName.split(' ')[0]}` : ''}! Painel Baby Motos
              </h1>
            </div>
            <p className="text-sky-200/70 text-xs sm:text-sm">Controle em tempo real de caixa, estoque e lucros de Itabaiana – SE.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Link href="/admin/veiculos/novo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all text-center">
                + Nova Moto
              </button>
            </Link>
            <Link href="/admin/relatorios" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center">
                Ver Relatórios
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Grid 1: Caixa & Lucro Realizado (Vendas Efetuadas) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Wallet size={16} className="text-emerald-500" /> Fluxo de Caixa Realizado (Vendas)
          </h2>
          <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200">
            🟢 Saldo Positivo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Caixa Total */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Total em Caixa</p>
              <div className="bg-emerald-50 p-2 sm:p-2.5 rounded-2xl text-emerald-600">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 truncate">R$ {fmt(stats.receitaTotal)}</p>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <CheckCircle size={13} /> {stats.vendidos} venda(s) realizada(s)
            </p>
          </div>

          {/* Lucro Líquido no Caixa */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Lucro Líquido Caixa</p>
              <div className="bg-sky-50 p-2 sm:p-2.5 rounded-2xl text-sky-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-sky-600 truncate">+R$ {fmt(stats.lucroTotal)}</p>
            <p className="text-xs text-gray-500 font-bold mt-1.5">
              Margem média: <strong className="text-sky-700">{stats.margemMedia.toFixed(1)}%</strong>
            </p>
          </div>

          {/* Custo Total das Vendas */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Custo das Vendas</p>
              <div className="bg-red-50 p-2 sm:p-2.5 rounded-2xl text-red-500">
                <ShieldAlert size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-800 truncate">R$ {fmt(stats.custoVendas)}</p>
            <p className="text-xs text-gray-400 font-medium mt-1.5">Capital recuperado</p>
          </div>

          {/* Motos Vendidas */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Motos Vendidas</p>
              <div className="bg-purple-50 p-2 sm:p-2.5 rounded-2xl text-purple-600">
                <Bike size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{stats.vendidos}</p>
            <p className="text-xs text-gray-400 font-medium mt-1.5">Retiradas da vitrine</p>
          </div>
        </div>
      </div>

      {/* Grid 2: Patrimônio Atual em Estoque */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Layers size={16} className="text-sky-500" /> Patrimônio Atual em Pátio / Estoque
          </h2>
          <span className="self-start sm:self-auto px-3 py-1 bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-sky-200">
            {stats.disponiveis} Moto(s) no Pátio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Capital Investido no Estoque */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0c1a2e] text-white p-5 sm:p-6 rounded-3xl shadow-md border border-slate-800">
            <p className="text-xs font-black text-sky-400 uppercase tracking-wider mb-2">Capital Investido (Custo)</p>
            <p className="text-2xl sm:text-3xl font-black text-white truncate">R$ {fmt(stats.custoEstoqueDisponivel)}</p>
            <p className="text-xs text-gray-400 mt-2">Dinheiro alocado em motos no pátio</p>
          </div>

          {/* Potencial de Venda do Estoque */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-blue-800">
            <p className="text-xs font-black text-sky-300 uppercase tracking-wider mb-2">Potencial de Venda (Estoque)</p>
            <p className="text-2xl sm:text-3xl font-black text-white truncate">R$ {fmt(stats.valorVendaEstoqueDisponivel)}</p>
            <p className="text-xs text-sky-200/70 mt-2">Valor total se vender todo estoque</p>
          </div>

          {/* Lucro Previsto */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-emerald-800">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2">Lucro Projetado em Estoque</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 truncate">+R$ {fmt(stats.lucroProjetadoEstoque)}</p>
            <p className="text-xs text-gray-400 mt-2">Lucro garantido com as motos atuais</p>
          </div>
        </div>
      </div>

      {/* Grid 3: Histórico de Vendas & Resumo Operacional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Últimas Vendas */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-black text-primary uppercase flex items-center gap-2 text-xs sm:text-sm tracking-wider">
              <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" /> Últimas Vendas no Caixa
            </h3>
            <Link href="/admin/relatorios" className="text-[11px] sm:text-xs font-black text-sky-600 hover:text-sky-700 flex items-center gap-1 uppercase tracking-wider">
              Relatório <ArrowRight size={13} />
            </Link>
          </div>
          {recentSales.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-gray-400">
              <Bike size={40} className="mx-auto mb-3 opacity-25 text-sky-500" />
              <p className="text-sm font-bold text-gray-700">Nenhuma venda registrada ainda no caixa.</p>
              <p className="text-xs mt-1 text-gray-400">Na aba <strong>Veículos</strong>, clique no botão <strong>$ VENDER</strong> para registrar vendas instantâneas.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentSales.map((sale) => (
                <div key={sale.id || Math.random()} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black shadow-sm flex-shrink-0">
                      <DollarSign size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-gray-900 truncate">{sale.vehicleName}</p>
                      <p className="text-[11px] text-gray-400 font-medium truncate">
                        Comprador: <span className="font-bold text-gray-600">{sale.compradorNome || 'Cliente'}</span> • {formatDate(sale.dataVenda)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-13 sm:pl-0">
                    <p className="text-sm sm:text-base font-black text-gray-900">R$ {fmt(sale.precoVenda)}</p>
                    <p className="text-[11px] sm:text-xs font-black text-emerald-600">+R$ {fmt(sale.lucro)} lucro</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Balanço Geral */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="font-heading font-black text-primary uppercase flex items-center gap-2 text-xs sm:text-sm tracking-wider">
            <BarChart2 size={18} className="text-sky-500" /> Balanço Geral Baby Motos
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-bold">Total de Motos Cadastradas</span>
              <span className="font-black text-gray-900">{stats.totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-bold">Motos Disponíveis</span>
              <span className="font-black text-emerald-600">{stats.disponiveis}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-bold">Motos Vendidas</span>
              <span className="font-black text-purple-600">{stats.vendidos}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-bold">Capital em Estoque (Custo)</span>
              <span className="font-black text-slate-800">R$ {fmt(stats.custoEstoqueDisponivel)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-bold">Lucro Projetado em Pátio</span>
              <span className="font-black text-sky-600">+R$ {fmt(stats.lucroProjetadoEstoque)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100">
              <span className="text-emerald-800 font-black text-xs">Lucro Realizado Caixa</span>
              <span className="font-black text-emerald-700 text-sm sm:text-base">+R$ {fmt(stats.lucroTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
