'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Vehicle } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { MessageCircle, ShoppingCart, ArrowLeft, Calendar, Gauge, Info, ChevronRight, ShieldCheck } from 'lucide-react';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        const { db } = await import('@/lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        
        const docRef = doc(db, 'vehicles', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setVehicle({ id: docSnap.id, ...data } as Vehicle);
        } else {
          setVehicle(null);
        }
      } catch (error) {
        console.error('Error fetching vehicle from Firestore:', error);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Info size={48} className="text-gray-200" />
        </div>
        <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter mb-4">Veículo não encontrado</h1>
        <button 
          onClick={() => router.push('/veiculos')} 
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const images = vehicle.fotos && vehicle.fotos.length > 0 
    ? vehicle.fotos.map((f: { url: string }) => f.url) 
    : ['/assets/placeholder-vehicle.jpg'];

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Gostaria de mais informações sobre o ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} anunciado por R$ ${vehicle.preco.toLocaleString('pt-BR')}`);
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5579991015150'}?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()} 
          className="mb-10 flex items-center space-x-3 text-gray-400 hover:text-primary transition-all group"
        >
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-gray-50">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar para a busca</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] bg-white rounded-[3rem] overflow-hidden shadow-premium border border-gray-100 group">
              <Image 
                src={images[activeImage]} 
                alt={vehicle.modelo} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {vehicle.promocao && (
                <div className="absolute top-8 left-8 bg-secondary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse">
                  Oferta Destaque
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-[1.5rem] overflow-hidden border-4 transition-all duration-300 ${activeImage === idx ? 'border-secondary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <Image src={img} alt={`${vehicle.modelo} thumbnail`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section - 5 cols */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100">
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px]">{vehicle.tipo}</span>
                  <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <ShieldCheck size={12} />
                    <span className="text-[9px] font-black uppercase">Periciado</span>
                  </div>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter leading-none">
                  {vehicle.marca} <br />
                  <span className="text-secondary">{vehicle.modelo}</span>
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{vehicle.ano} • Seminovo Premium</span>
                </div>
              </div>

              <div className="mb-10 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Preço de Venda</span>
                <div className="flex items-baseline flex-wrap gap-2">
                  <span className="text-lg md:text-xl font-bold text-primary">R$</span>
                  <span className="text-2xl sm:text-4xl md:text-5xl font-black text-primary tracking-tighter italic break-all">
                    {Number(vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-xl transform active:scale-95 translate-y-0 hover:-translate-y-1"
                >
                  <MessageCircle size={22} />
                  <span>Chamar no WhatsApp</span>
                </button>
                <button 
                  onClick={() => addToCart(vehicle)}
                  className="w-full bg-primary hover:bg-black text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-xl transform active:scale-95"
                >
                  <ShoppingCart size={22} className="text-secondary" />
                  <span>Reservar Veículo</span>
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                <Info size={14} className="mr-2 text-secondary" /> Detalhes Técnicos
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Marca", value: vehicle.marca },
                  { label: "Modelo", value: vehicle.modelo },
                  { label: "Ano", value: vehicle.ano },
                  { label: "Categoria", value: vehicle.tipo },
                  { label: "Disponibilidade", value: vehicle.estoque > 0 ? "Em Estoque" : "Indisponível" }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-500">{spec.label}</span>
                    <span className="text-sm font-black text-primary uppercase tracking-widest">{spec.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Descrição</p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {vehicle.descricao || "Veículo selecionado para o nosso catálogo premium, com garantia de procedência e revisado por nossa equipe técnica especializada."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
