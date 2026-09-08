'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/lib/types';
import { MessageCircle, ShoppingCart, Calendar, Info } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '55799999960149';

  const images = vehicle.fotos && vehicle.fotos.length > 0
    ? vehicle.fotos.sort((a: any, b: any) => a.position - b.position).map((f: any) => f.url)
    : ['/assets/placeholder-vehicle.jpg'];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá Cabo Car Multimarcas! Tenho interesse no veículo:\n\n${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}\nPreço: R$ ${Number(vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nPoderia me passar mais detalhes e simulação de financiamento?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:shadow-premium-hover hover:-translate-y-2 border border-gray-100 bg-white">
      {/* Image Carousel */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {vehicle.promocao && (
            <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/40 animate-pulse">
              Destaque
            </div>
          )}
          <div className="bg-black/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/10">
            {vehicle.tipo}
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black z-10 border border-white/10">
          {vehicle.ano}
        </div>

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentImageIndex === index
                    ? 'bg-red-600 w-8'
                    : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white">
        <div className="space-y-1">
          <h3 className="font-heading text-xl sm:text-2xl font-black text-gray-950 uppercase italic tracking-tighter leading-tight">
            {vehicle.marca} <span className="text-red-600">{vehicle.modelo}</span>
          </h3>
          <div className="flex items-center text-gray-400 space-x-2">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{vehicle.ano} • {vehicle.cor || 'Seminovo'}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preço de Venda</p>
          <div className="flex items-baseline flex-wrap gap-1">
            <span className="text-sm sm:text-lg font-black text-red-600">R$</span>
            <p className="text-xl sm:text-3xl font-heading font-black text-gray-950 tracking-tighter">
              {Number(vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-3">
            <Link
              href={`/veiculos/${vehicle.id}`}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Info size={14} />
              <span>Detalhes</span>
            </Link>
            <button
              onClick={() => addToCart(vehicle)}
              className="flex-1 bg-[#0a0a0c] hover:bg-black text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xl active:scale-95 border border-white/10"
            >
              <ShoppingCart size={14} className="text-red-500" />
              <span>Reservar</span>
            </button>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20 active:scale-95"
          >
            <MessageCircle size={16} />
            <span>Negociar via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
