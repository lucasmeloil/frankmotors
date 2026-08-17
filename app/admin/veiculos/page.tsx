'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, ExternalLink, Bike, Lock, TrendingUp, CheckCircle, DollarSign, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { getAllVehicles, deleteVehicleFromDatabase, saveVehicleToDatabase, VehicleRecord } from '@/lib/db-service';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Modal de Venda Rápida
  const [selectedVehicleForSale, setSelectedVehicleForSale] = useState<VehicleRecord | null>(null);
  const [saleForm, setSaleForm] = useState({
    precoVenda: 0,
    dataVenda: new Date().toISOString().split('T')[0],
    compradorNome: ''
  });
  const [selling, setSelling] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAllVehicles(true);
      setVehicles(list);
    } catch (e: any) {
      console.error(e);
      toast.error('Erro ao carregar veículos do banco de dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (id: string, name: string) => {
    toast.warning(`Deseja realmente excluir ${name}?`, {
      action: {
        label: 'Excluir',
        onClick: async () => {
          try {
            await deleteVehicleFromDatabase(id);
            setVehicles(vehicles.filter(v => v.id !== id));
            toast.success(`${name} excluído com sucesso!`);
          } catch (e) {
            console.error(e);
            toast.error('Erro ao excluir veículo.');
          }
        },
      },
      duration: 5000,
    });
  };

  const handleOpenSaleModal = (vehicle: VehicleRecord) => {
    setSelectedVehicleForSale(vehicle);
    setSaleForm({
      precoVenda: Number(vehicle.preco) || 0,
      dataVenda: new Date().toISOString().split('T')[0],
      compradorNome: ''
    });
  };

  const handleConfirmSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleForSale?.id) return;
    if (saleForm.precoVenda <= 0) {
      toast.error('Informe o valor final de venda.');
      return;
    }

    setSelling(true);
    try {
      const custo = Number(selectedVehicleForSale.precoCusto) || 0;
      const precoVendaFinal = Number(saleForm.precoVenda);
      const lucroFinal = precoVendaFinal - custo;

      const updatedVehicle: VehicleRecord = {
        ...selectedVehicleForSale,
        preco: precoVendaFinal,
        lucro: lucroFinal,
        status: 'vendido',
        estoque: 0,
        dataVenda: saleForm.dataVenda,
        compradorNome: saleForm.compradorNome.trim() || 'Cliente Baby Motos'
      };

      await saveVehicleToDatabase(updatedVehicle, selectedVehicleForSale.id);

      toast.success(`🎉 Venda registrada com sucesso!`, {
        description: `Lucro obtido: R$ ${lucroFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      });

      setSelectedVehicleForSale(null);
      fetchVehicles();
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao registrar venda: ' + (err.message || ''));
    } finally {
      setSelling(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = (v.modelo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.marca || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || (v.status || 'disponivel') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const fmt = (n: number) => Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por modelo ou marca..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 transition-all text-sm outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold text-xs uppercase tracking-wider outline-none text-gray-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">✅ Disponíveis</option>
            <option value="reservado">🟡 Reservados</option>
            <option value="vendido">🔴 Vendidos</option>
          </select>
        </div>
        
        <Link href="/admin/veiculos/novo">
          <button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/25 transition-all text-sm uppercase tracking-wider">
            <Plus size={18} />
            <span>Adicionar Veículo</span>
          </button>
        </Link>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Veículo & Cor</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Ano/Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Custo (Compra)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Venda (Público)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Lucro Estimado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500 mx-auto mb-2"></div>
                    Carregando veículos da Baby Motos...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium whitespace-pre-line">
                    Nenhum veículo encontrado no sistema.{"\n"}Clique em "Adicionar Veículo" para começar!
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const custo = Number(vehicle.precoCusto || 0);
                  const venda = Number(vehicle.preco || 0);
                  const lucro = venda - custo;
                  const status = vehicle.status || 'disponivel';

                  return (
                    <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                            <Image 
                              src={vehicle.fotos?.[0]?.url || '/assets/placeholder-vehicle.jpg'} 
                              alt={vehicle.modelo || 'Veículo'} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{vehicle.marca} {vehicle.modelo}</p>
                            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">{vehicle.cor || 'Cor padrão'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-700">{vehicle.ano}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{vehicle.tipo || 'moto'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-red-500 flex items-center gap-1">
                          <Lock size={11} className="text-amber-500" />
                          R$ {fmt(custo)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900">
                          R$ {fmt(venda)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-black flex items-center gap-1 ${lucro >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          <TrendingUp size={12} />
                          {lucro >= 0 ? '+' : ''}R$ {fmt(lucro)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {status === 'vendido' ? (
                          <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 inline-block">
                            🔴 Vendido
                          </span>
                        ) : status === 'reservado' ? (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100 inline-block">
                            🟡 Reservado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 inline-block">
                            ✅ Disponível
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Botão de Vender Rápido se não vendido */}
                          {status !== 'vendido' && (
                            <button
                              onClick={() => handleOpenSaleModal(vehicle)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
                              title="Registrar Venda Deste Veículo"
                            >
                              <DollarSign size={13} />
                              <span>Vender</span>
                            </button>
                          )}
                          
                          <Link href={`/veiculos/${vehicle.id}`} target="_blank">
                            <button className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all" title="Ver no site público">
                              <ExternalLink size={16} />
                            </button>
                          </Link>
                          <Link href={`/admin/veiculos/editar/${vehicle.id}`}>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                              <Edit2 size={16} />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(vehicle.id || '', `${vehicle.marca} ${vehicle.modelo}`)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro de Venda */}
      {selectedVehicleForSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-6 border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-primary uppercase">Registrar Venda</h3>
                  <p className="text-xs text-gray-400 font-bold">{selectedVehicleForSale.marca} {selectedVehicleForSale.modelo} ({selectedVehicleForSale.ano})</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVehicleForSale(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmSale} className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Preço de Compra (Custo):</span>
                  <span className="font-black text-red-500">R$ {fmt(Number(selectedVehicleForSale.precoCusto))}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Lucro nesta venda:</span>
                  <span className="font-black text-emerald-600">
                    +R$ {fmt(Number(saleForm.precoVenda) - Number(selectedVehicleForSale.precoCusto))}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Valor Final da Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-lg text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={saleForm.precoVenda || ''}
                  onChange={e => setSaleForm({ ...saleForm, precoVenda: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Data da Venda</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={saleForm.dataVenda}
                    onChange={e => setSaleForm({ ...saleForm, dataVenda: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Nome do Comprador</label>
                  <input
                    type="text"
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={saleForm.compradorNome}
                    onChange={e => setSaleForm({ ...saleForm, compradorNome: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedVehicleForSale(null)}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={selling}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all flex items-center space-x-2"
                >
                  {selling ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Confirmar Venda</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
