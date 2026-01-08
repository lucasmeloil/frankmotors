'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, ExternalLink, Tag as TagIcon, Car } from 'lucide-react';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vehicles?pageSize=100');
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (e) {
      console.error(e);
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
            const { db } = await import('@/lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');

            const vehicleRef = doc(db, 'vehicles', id);
            await deleteDoc(vehicleRef);

            setVehicles(vehicles.filter(v => v.id !== id));
            toast.success(`${name} excluído com sucesso!`);
          } catch (e) {
            console.error(e);
            toast.error('Erro ao excluir do Firestore.');
          }
        },
      },
      duration: 5000,
    });
  };

  const filteredVehicles = vehicles.filter(v => 
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por modelo ou marca..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Link href="/admin/veiculos/novo">
          <button className="bg-secondary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-100 transition-all">
            <Plus size={20} />
            <span>ADICIONAR VEÍCULO</span>
          </button>
        </Link>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Veículo</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Ano/Tipo</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Preço</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Estoque</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-secondary mx-auto mb-2"></div>
                    Carregando estoque...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium whitespace-pre-line">
                    Nenhum veículo encontrado.{"\n"}Comece adicionando seu primeiro item!
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image 
                            src={vehicle.fotos?.[0]?.url || '/assets/placeholder-vehicle.jpg'} 
                            alt={vehicle.modelo} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-primary">{vehicle.marca} {vehicle.modelo}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: {vehicle.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-600">{vehicle.ano}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{vehicle.tipo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-secondary">
                        R$ {Number(vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${vehicle.estoque > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm font-bold text-gray-600">{vehicle.estoque} un.</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.promocao ? (
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 flex items-center w-fit">
                          <TagIcon size={10} className="mr-1" /> Promoção
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100 flex items-center w-fit">
                          Padrão
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/veiculos/${vehicle.id}`} target="_blank">
                          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Ver no site">
                            <ExternalLink size={18} />
                          </button>
                        </Link>
                        <Link href={`/admin/veiculos/editar/${vehicle.id}`}>
                          <button className="p-2 text-gray-400 hover:text-secondary hover:bg-red-50 rounded-lg transition-all" title="Editar">
                            <Edit2 size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(vehicle.id, `${vehicle.marca} ${vehicle.modelo}`)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
