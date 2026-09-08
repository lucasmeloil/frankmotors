'use client';

import { useState, useEffect, useCallback } from 'react';
import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/lib/types';
import { Filter, X, ChevronDown, Trash2 } from 'lucide-react';

export default function VeiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    marca: '',
    ano: '',
    tipo: '',
    precoMin: '',
    precoMax: '',
    sortBy: 'relevancia',
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', '12');

      if (filters.marca) params.append('marca', filters.marca);
      if (filters.ano) params.append('ano', filters.ano);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.precoMin) params.append('precoMin', filters.precoMin);
      if (filters.precoMax) params.append('precoMax', filters.precoMax);

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      const data = await res.json();

      setVehicles(data.vehicles || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      marca: '',
      ano: '',
      tipo: '',
      precoMin: '',
      precoMax: '',
      sortBy: 'relevancia',
    });
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-gray-900 text-white py-12 mb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            Catálogo <span className="text-secondary font-normal">Completo</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Carros novos e seminovos multimarcas com procedência e garantia CABO CAR
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] shadow-premium p-8 sticky top-32 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Filter size={18} className="text-secondary" />
                  <h2 className="font-heading text-xl font-black text-primary uppercase italic">Filtros</h2>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-secondary transition-colors flex items-center space-x-1"
                >
                  <Trash2 size={12} />
                  <span>Limpar</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Tipo */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Categoria</label>
                  <div className="relative">
                    <select
                      value={filters.tipo}
                      onChange={(e) => handleFilterChange('tipo', e.target.value)}
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-2xl px-5 py-4 font-bold text-sm appearance-none transition-all"
                    >
                      <option value="">Todas as Categorias</option>
                      <option value="carro">Carros & Sedans</option>
                      <option value="suv">SUVs & Crossovers</option>
                      <option value="picape">Picapes & Utilitários</option>
                      <option value="hatch">Hatchbacks</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Marca */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Marca</label>
                  <input
                    type="text"
                    value={filters.marca}
                    onChange={(e) => handleFilterChange('marca', e.target.value)}
                    placeholder="Ex: Honda, Toyota..."
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-2xl px-5 py-4 font-bold text-sm transition-all"
                  />
                </div>

                {/* Ano */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Ano Mínimo</label>
                  <input
                    type="number"
                    value={filters.ano}
                    onChange={(e) => handleFilterChange('ano', e.target.value)}
                    placeholder="Ex: 2020"
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-2xl px-5 py-4 font-bold text-sm transition-all"
                  />
                </div>

                {/* Preço Range */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Faixa de Preço</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={filters.precoMin}
                      onChange={(e) => handleFilterChange('precoMin', e.target.value)}
                      placeholder="Mínimo"
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-2xl px-5 py-4 font-bold text-xs transition-all"
                    />
                    <input
                      type="number"
                      value={filters.precoMax}
                      onChange={(e) => handleFilterChange('precoMax', e.target.value)}
                      placeholder="Máximo"
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-2xl px-5 py-4 font-bold text-xs transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Vehicles Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Preparando catálogo...</p>
              </div>
            ) : vehicles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-6 mt-16">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-5 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                    >
                      Anterior
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Página</span>
                      <span className="font-heading text-xl font-black text-primary italic leading-none">{page} <span className="text-gray-300 font-normal">/</span> {totalPages}</span>
                    </div>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="p-5 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] shadow-premium border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X size={48} className="text-gray-200" />
                </div>
                <h2 className="text-2xl font-black text-primary uppercase italic mb-2">Nenhum veículo encontrado</h2>
                <p className="text-gray-400 font-medium mb-8">Tente ajustar seus filtros para encontrar o que procura.</p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl active:scale-95"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
