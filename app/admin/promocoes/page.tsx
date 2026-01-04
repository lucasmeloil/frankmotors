'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Edit2, Trash2, Car, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';

export default function AdminPromotionsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vehicles?promocao=true');
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 font-medium">Gerencie os veículos que aparecem como destaque em promoção no site.</p>
        <button className="bg-secondary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg transition-all">
          <Plus size={20} />
          <span>NOVA PROMOÇÃO</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">Carregando promoções...</div>
        ) : vehicles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">Nenhum veículo em promoção no momento.</div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="relative h-48">
                <Image 
                  src={vehicle.fotos?.[0]?.url || '/assets/placeholder-vehicle.jpg'} 
                  alt={vehicle.modelo} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  Ativo
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-heading font-black text-primary uppercase mb-1">{vehicle.marca} {vehicle.modelo}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{vehicle.ano} • {vehicle.tipo}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Oferta</p>
                    <p className="text-xl font-black text-secondary">R$ {Number(vehicle.preco).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-secondary hover:bg-red-50 rounded-lg transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feature Section */}
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-start space-x-6">
        <div className="bg-white p-4 rounded-2xl text-amber-500 shadow-sm flex-shrink-0">
          <TrendingDown size={32} />
        </div>
        <div>
          <h3 className="font-heading text-xl font-black text-amber-900 uppercase mb-2">Dica de Conversão</h3>
          <p className="text-amber-800/80 leading-relaxed font-medium">
            Veículos em promoção recebem até 3x mais cliques e contatos via WhatsApp. 
            Mantenha suas ofertas atualizadas e com descrições atrativas para maximizar suas vendas.
          </p>
        </div>
      </div>
    </div>
  );
}
