'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Percent, 
  Filter, 
  Bike,
  Layers,
  FileText,
  Building2,
  MapPin,
  Printer,
  Calculator
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { getAllVehicles, getAllVendas, VehicleRecord, VendaRecord } from '@/lib/db-service';

type Periodo = 'todos' | 'hoje' | 'semana' | 'mes' | 'personalizado';
type TipoVisualizacao = 'completo' | 'estoque' | 'vendas';

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<Periodo>('todos');
  const [tipoVisualizacao, setTipoVisualizacao] = useState<TipoVisualizacao>('completo');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [vendas, setVendas] = useState<VendaRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataHoraGeracao, setDataHoraGeracao] = useState('');

  useEffect(() => {
    setDataHoraGeracao(new Date().toLocaleString('pt-BR'));
  }, []);

  const getPeriodDates = useCallback((p: Periodo) => {
    const now = new Date();
    let inicio = new Date();
    let fim = new Date();

    switch (p) {
      case 'hoje':
        inicio.setHours(0, 0, 0, 0);
        fim.setHours(23, 59, 59, 999);
        break;
      case 'semana':
        inicio.setDate(now.getDate() - 7);
        inicio.setHours(0, 0, 0, 0);
        fim.setHours(23, 59, 59, 999);
        break;
      case 'mes':
        inicio.setDate(1);
        inicio.setHours(0, 0, 0, 0);
        fim.setHours(23, 59, 59, 999);
        break;
      case 'personalizado':
        return {
          inicio: dataInicio ? new Date(`${dataInicio}T00:00:00`) : null,
          fim: dataFim ? new Date(`${dataFim}T23:59:59`) : null
        };
      default:
        return { inicio: null, fim: null };
    }
    return { inicio, fim };
  }, [dataInicio, dataFim]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dataVehicles, dataVendas] = await Promise.all([
        getAllVehicles(true),
        getAllVendas()
      ]);

      setVehicles(Array.isArray(dataVehicles) ? dataVehicles : []);

      // Filtrar vendas por período
      const { inicio, fim } = getPeriodDates(periodo);
      let vendasFiltradas = Array.isArray(dataVendas) ? dataVendas : [];

      if (inicio && fim) {
        vendasFiltradas = vendasFiltradas.filter(v => {
          if (!v.dataVenda) return false;
          const dv = new Date(v.dataVenda.toDate ? v.dataVenda.toDate() : v.dataVenda);
          return dv >= inicio && dv <= fim;
        });
      }

      setVendas(vendasFiltradas);
    } catch (e) {
      console.error('Erro ao carregar dados do relatório:', e);
      toast.error('Erro ao carregar dados dos relatórios.');
    } finally {
      setLoading(false);
    }
  }, [periodo, getPeriodDates]);

  useEffect(() => {
    if (periodo !== 'personalizado' || (dataInicio && dataFim)) {
      fetchData();
    }
  }, [periodo, dataInicio, dataFim, fetchData]);

  // Cálculos de Vendas Realizadas (Caixa)
  const totalReceitaVendas = vendas.reduce((a, v) => a + Number(v.precoVenda || 0), 0);
  const totalCustoVendas = vendas.reduce((a, v) => a + Number(v.precoCusto || 0), 0);
  const totalLucroRealizado = vendas.reduce((a, v) => a + Number(v.lucro || 0), 0);
  const margemMediaVendas = totalCustoVendas > 0 ? ((totalLucroRealizado / totalCustoVendas) * 100) : 0;

  // Cálculos de Estoque em Pátio (Disponíveis)
  const motosDisponiveis = vehicles.filter(v => !v.status || v.status === 'disponivel' || v.status === 'reservado');
  const totalUnidadesEstoque = motosDisponiveis.reduce((a, v) => a + (Number(v.estoque) || 1), 0);
  const custoTotalEstoque = motosDisponiveis.reduce((a, v) => a + (Number(v.precoCusto || 0) * (Number(v.estoque) || 1)), 0);
  const valorVendaTotalEstoque = motosDisponiveis.reduce((a, v) => a + (Number(v.preco || 0) * (Number(v.estoque) || 1)), 0);
  const lucroProjetadoEstoque = valorVendaTotalEstoque - custoTotalEstoque;
  const margemProjetadaEstoque = custoTotalEstoque > 0 ? ((lucroProjetadoEstoque / custoTotalEstoque) * 100) : 0;

  const fmt = (n: number) => Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const fmtDate = (ts: any) => {
    if (!ts) return '—';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('pt-BR');
    } catch { return '—'; }
  };

  const periodLabels: Record<Periodo, string> = {
    todos: 'Todo o Histórico',
    hoje: 'Hoje',
    semana: 'Últimos 7 dias',
    mes: 'Este Mês',
    personalizado: 'Personalizado'
  };

  const handlePrint = () => {
    setDataHoraGeracao(new Date().toLocaleString('pt-BR'));
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      {/* Estilos Exclusivos de Impressão PDF - Sem overlays e sem película escura */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 6mm 8mm;
            size: A4 landscape;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 9pt !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          aside, nav, header, .no-print, button, .backdrop-blur-sm {
            display: none !important;
          }
          #relatorio-print {
            display: block !important;
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
          }
          .page-break {
            page-break-inside: avoid;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            padding: 5px 6px !important;
          }
        }
      `}</style>

      <div id="relatorio-print" className="space-y-6 pb-20 pt-2 bg-white">
        
        {/* Painel Superior de Ações (Apenas na Tela - Oculto na Impressão) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="font-heading text-2xl font-black text-primary uppercase flex items-center gap-2">
              <Building2 size={26} className="text-sky-500" /> Relatório Financeiro Preciso — Baby Motos
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">
              Cálculo exato por veículo unitário e acumulado total do estoque e vendas
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-sky-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <Printer size={18} />
            <span>Imprimir / Baixar PDF</span>
          </button>
        </div>

        {/* Seleção de Abas de Visualização (Tela) */}
        <div className="flex flex-wrap gap-2.5 no-print">
          <button
            onClick={() => setTipoVisualizacao('completo')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
              tipoVisualizacao === 'completo'
                ? 'bg-primary text-white shadow-lg ring-2 ring-sky-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FileText size={16} />
            <span>📋 Relatório Geral Completo</span>
          </button>

          <button
            onClick={() => setTipoVisualizacao('estoque')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
              tipoVisualizacao === 'estoque'
                ? 'bg-sky-600 text-white shadow-sky-600/30 ring-2 ring-sky-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Layers size={16} />
            <span>🏍️ Somente Estoque no Pátio ({totalUnidadesEstoque} un)</span>
          </button>

          <button
            onClick={() => setTipoVisualizacao('vendas')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
              tipoVisualizacao === 'vendas'
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <DollarSign size={16} />
            <span>💰 Somente Vendas ({vendas.length})</span>
          </button>
        </div>

        {/* Filtros de Período (para Vendas) */}
        {(tipoVisualizacao === 'vendas' || tipoVisualizacao === 'completo') && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 no-print space-y-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-sky-500" />
              <span className="font-black text-xs text-gray-700 uppercase tracking-widest">Filtrar Histórico de Vendas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['todos', 'hoje', 'semana', 'mes', 'personalizado'] as Periodo[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    periodo === p
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>

            {periodo === 'personalizado' && (
              <div className="pt-2 flex flex-wrap gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Início</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                    className="px-3.5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Fim</label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                    className="px-3.5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold text-xs"
                  />
                </div>
                <button
                  onClick={fetchData}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-black uppercase tracking-wider text-xs transition-all cursor-pointer"
                >
                  Filtrar
                </button>
              </div>
            )}
          </div>
        )}

        {/* 🏍️ CABEÇALHO OFICIAL BABY MOTOS (Visível na Tela e na Impressão PDF) */}
        <div className="bg-gradient-to-r from-[#040914] via-[#0b192c] to-[#040914] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-6 print:rounded-2xl print:p-4 print:border print:border-sky-500">
          
          {/* Logo & Marca Oficial */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative w-44 h-14 sm:w-52 sm:h-16 shrink-0">
              <Image 
                src="/assets/logo-babymotos-transparent.png" 
                alt="Baby Motos" 
                fill 
                className="object-contain filter drop-shadow-[0_2px_15px_rgba(0,166,255,0.7)]" 
                priority
              />
            </div>
            <div className="hidden sm:block border-l border-white/15 pl-4">
              <p className="text-xs font-black uppercase tracking-widest text-sky-400">
                Compra • Vende • Troca
              </p>
              <p className="text-[11px] text-gray-300 font-bold flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-sky-400" /> Itabaiana – Sergipe
              </p>
            </div>
          </div>

          {/* Dados do Relatório & Contato */}
          <div className="text-center md:text-right space-y-1">
            <div className="inline-block bg-sky-500/20 border border-sky-400/30 px-3 py-1 rounded-full mb-1">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-300">
                {tipoVisualizacao === 'estoque' ? '📊 Relatório de Estoque no Pátio' : tipoVisualizacao === 'vendas' ? '💰 Relatório de Vendas Realizadas' : '📋 Relatório Financeiro Geral Oficial'}
              </p>
            </div>
            <p className="text-[11px] text-gray-300 font-bold">
              Período: <span className="text-white font-black">{periodLabels[periodo]}</span>
            </p>
            <p className="text-[10px] text-gray-400 font-bold flex items-center justify-center md:justify-end gap-2">
              <span>Baby: (79) 99907-0264</span> • <span>Boniek: (79) 99974-0934</span>
            </p>
            <p className="text-[9px] text-sky-300/80 font-mono">
              Emissão: {dataHoraGeracao || '17/08/2026'}
            </p>
          </div>

        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-sky-500" />
          </div>
        ) : (
          <>
            {/* SEÇÃO 1: ESTOQUE ATUAL NO PÁTIO */}
            {(tipoVisualizacao === 'completo' || tipoVisualizacao === 'estoque') && (
              <div className="space-y-4 page-break">
                
                {/* KPIs de Estoque */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-sky-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-sky-100 p-2 rounded-xl"><Package size={16} className="text-sky-600" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Motos no Pátio</p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{totalUnidadesEstoque} Unidade(s)</p>
                    <p className="text-xs text-sky-600 font-bold mt-1">{motosDisponiveis.length} modelo(s) cadastrado(s)</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-red-100 p-2 rounded-xl"><DollarSign size={16} className="text-red-500" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Capital Pago (Investido)</p>
                    </div>
                    <p className="text-2xl font-black text-red-500">R$ {fmt(custoTotalEstoque)}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Custo total das motos em pátio</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-blue-100 p-2 rounded-xl"><DollarSign size={16} className="text-blue-600" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Faturamento Previsto</p>
                    </div>
                    <p className="text-2xl font-black text-blue-700">R$ {fmt(valorVendaTotalEstoque)}</p>
                    <p className="text-xs text-blue-600 font-bold mt-1">Potencial bruto de venda</p>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-300">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-emerald-500 p-2 rounded-xl"><TrendingUp size={16} className="text-white" /></div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Lucro Previsto no Pátio</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-700">+R$ {fmt(lucroProjetadoEstoque)}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Margem: {margemProjetadaEstoque.toFixed(1)}%</p>
                  </div>
                </div>

                {/* TABELA DETALHADA DE ESTOQUE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-[#0b192c] text-white p-4 flex items-center justify-between">
                    <h3 className="font-heading font-black uppercase flex items-center gap-2 text-xs tracking-wider">
                      <Layers size={16} className="text-sky-400" /> Detalhamento do Estoque em Pátio — Valores por Veículo e Totais
                    </h3>
                    <span className="text-xs font-bold text-sky-300">{totalUnidadesEstoque} moto(s) em estoque</span>
                  </div>

                  {motosDisponiveis.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <Bike size={48} className="mx-auto mb-3 opacity-25" />
                      <p className="text-sm font-bold text-gray-700">Nenhuma moto disponível no estoque.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-sky-50 border-b border-sky-100 text-sky-950 font-black uppercase tracking-wider text-[9px] sm:text-[10px]">
                            <th className="px-3 py-3">Moto / Marca / Modelo</th>
                            <th className="px-3 py-3">Cor</th>
                            <th className="px-3 py-3">Ano</th>
                            <th className="px-2 py-3 text-center">Qtd</th>
                            <th className="px-3 py-3">Custo Unit.</th>
                            <th className="px-3 py-3">Venda Unit.</th>
                            <th className="px-3 py-3">Lucro Unit.</th>
                            <th className="px-3 py-3">Margem (%)</th>
                            <th className="px-3 py-3">Custo Total</th>
                            <th className="px-3 py-3">Venda Total</th>
                            <th className="px-3 py-3 text-right">Lucro Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {motosDisponiveis.map((moto, idx) => {
                            const qtd = Number(moto.estoque) || 1;
                            const custoUnit = Number(moto.precoCusto || 0);
                            const vendaUnit = Number(moto.preco || 0);
                            const lucroUnit = vendaUnit - custoUnit;
                            const margemUnit = custoUnit > 0 ? (lucroUnit / custoUnit) * 100 : 0;

                            const custoTotal = custoUnit * qtd;
                            const vendaTotal = vendaUnit * qtd;
                            const lucroTotal = vendaTotal - custoTotal;

                            return (
                              <tr key={moto.id || idx} className={`hover:bg-sky-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                <td className="px-3 py-3 font-black text-gray-900">
                                  {moto.marca} {moto.modelo}
                                </td>
                                <td className="px-3 py-3">
                                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-black rounded text-[10px] uppercase">
                                    {moto.cor || 'Padrão'}
                                  </span>
                                </td>
                                <td className="px-3 py-3 font-bold text-gray-800">
                                  {moto.ano}
                                </td>
                                <td className="px-2 py-3 text-center font-black text-gray-900 bg-sky-50/40">
                                  {qtd} un
                                </td>
                                <td className="px-3 py-3 font-bold text-red-500">
                                  R$ {fmt(custoUnit)}
                                </td>
                                <td className="px-3 py-3 font-bold text-gray-900">
                                  R$ {fmt(vendaUnit)}
                                </td>
                                <td className="px-3 py-3 font-black text-emerald-600">
                                  +R$ {fmt(lucroUnit)}
                                </td>
                                <td className="px-3 py-3 font-black text-purple-700">
                                  {margemUnit.toFixed(1)}%
                                </td>
                                <td className="px-3 py-3 font-black text-red-600">
                                  R$ {fmt(custoTotal)}
                                </td>
                                <td className="px-3 py-3 font-black text-blue-700">
                                  R$ {fmt(vendaTotal)}
                                </td>
                                <td className="px-3 py-3 text-right font-black text-emerald-700">
                                  +R$ {fmt(lucroTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-[#0b192c] text-white font-black text-[10px] sm:text-xs">
                          <tr>
                            <td colSpan={3} className="px-3 py-3.5 uppercase tracking-wider text-sky-300">TOTALIZADORES:</td>
                            <td className="px-2 py-3.5 text-center text-sky-300 font-black">{totalUnidadesEstoque} un</td>
                            <td colSpan={4} className="px-3 py-3.5 text-right uppercase tracking-wider text-gray-300">Patrimônio Geral:</td>
                            <td className="px-3 py-3.5 text-red-300 font-black">R$ {fmt(custoTotalEstoque)}</td>
                            <td className="px-3 py-3.5 text-white font-black">R$ {fmt(valorVendaTotalEstoque)}</td>
                            <td className="px-3 py-3.5 text-right text-emerald-300 font-black">+R$ {fmt(lucroProjetadoEstoque)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SEÇÃO 2: VENDAS REALIZADAS (CAIXA) */}
            {(tipoVisualizacao === 'completo' || tipoVisualizacao === 'vendas') && (
              <div className="space-y-4 pt-4 page-break">
                
                {/* KPIs de Vendas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-emerald-100 p-2 rounded-xl"><DollarSign size={16} className="text-emerald-600" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total em Caixa (Vendas)</p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">R$ {fmt(totalReceitaVendas)}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      {vendas.length > 0 ? `🟢 ${vendas.length} venda(s) registrada(s)` : 'Nenhuma venda efetuada'}
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-300">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-emerald-500 p-2 rounded-xl"><TrendingUp size={16} className="text-white" /></div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Lucro Líquido Realizado</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-700">+R$ {fmt(totalLucroRealizado)}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Saldo Positivo em Caixa</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-red-100 p-2 rounded-xl"><Package size={16} className="text-red-500" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valor Pago (Custos)</p>
                    </div>
                    <p className="text-2xl font-black text-red-500">R$ {fmt(totalCustoVendas)}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Capital recuperado</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-purple-100 p-2 rounded-xl"><Percent size={16} className="text-purple-600" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Margem de Vendas</p>
                    </div>
                    <p className="text-2xl font-black text-purple-600">
                      {margemMediaVendas.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Retorno sobre custo</p>
                  </div>
                </div>

                {/* TABELA DE VENDAS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-[#0b192c] text-white p-4 flex items-center justify-between">
                    <h3 className="font-heading font-black uppercase flex items-center gap-2 text-xs tracking-wider">
                      <FileText size={16} className="text-emerald-400" /> Histórico de Vendas Realizadas ({vendas.length})
                    </h3>
                    <span className="text-xs font-bold text-sky-300">{vendas.length} venda(s) registrada(s)</span>
                  </div>

                  {vendas.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 bg-gray-50/50">
                      <Bike size={44} className="mx-auto mb-2 opacity-25" />
                      <p className="text-sm font-bold text-gray-700">Nenhuma venda registrada ainda.</p>
                      <p className="text-xs mt-1 text-gray-400">
                        Quando você vender uma moto pelo botão <strong>&quot;$ Vender&quot;</strong> no menu Veículos, a transação e o lucro líquido serão registrados aqui instantaneamente.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-sky-50 border-b border-sky-100 text-sky-950 font-black uppercase tracking-wider text-[10px]">
                            <th className="px-4 py-3">Moto / Modelo</th>
                            <th className="px-4 py-3">Cor</th>
                            <th className="px-4 py-3">Valor Pago (Custo)</th>
                            <th className="px-4 py-3">Valor de Venda</th>
                            <th className="px-4 py-3">Lucro Líquido</th>
                            <th className="px-4 py-3">Margem (%)</th>
                            <th className="px-4 py-3">Comprador</th>
                            <th className="px-4 py-3 text-right">Data</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vendas.map((venda, idx) => (
                            <tr key={venda.id || idx} className={`hover:bg-sky-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                              <td className="px-4 py-3 font-black text-gray-900">
                                {venda.vehicleName}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-black rounded text-[10px] uppercase">
                                  {venda.cor || 'Padrão'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-bold text-red-500">
                                R$ {fmt(venda.precoCusto)}
                              </td>
                              <td className="px-4 py-3 font-black text-gray-900">
                                R$ {fmt(venda.precoVenda)}
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-black text-emerald-600">
                                  +R$ {fmt(venda.lucro)}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-black text-purple-700">
                                {Number(venda.margemPercent || 0).toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 text-gray-700 font-medium">
                                {venda.compradorNome || 'Cliente'}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-500 font-bold">
                                {fmtDate(venda.dataVenda)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-[#0b192c] text-white font-black">
                          <tr>
                            <td colSpan={2} className="px-4 py-3.5 uppercase tracking-wider text-sky-300">TOTALIZADORES:</td>
                            <td className="px-4 py-3.5 text-red-300">R$ {fmt(totalCustoVendas)}</td>
                            <td className="px-4 py-3.5 text-white">R$ {fmt(totalReceitaVendas)}</td>
                            <td className="px-4 py-3.5 text-emerald-300">+R$ {fmt(totalLucroRealizado)}</td>
                            <td className="px-4 py-3.5 text-purple-300">{margemMediaVendas.toFixed(1)}%</td>
                            <td colSpan={2} className="px-4 py-3.5 text-right text-emerald-300 uppercase">
                              🟢 Saldo Positivo em Caixa
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}

        {/* Rodapé Oficial da Impressão */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-bold">
          <p>Baby Motos • Sistema de Gestão e Inteligência Financeira • Itabaiana – SE</p>
          <p className="mt-1 sm:mt-0 font-black text-sky-600">DEUS É BOM O TEMPO TODO 🙏🏼</p>
        </div>

      </div>
    </>
  );
}
