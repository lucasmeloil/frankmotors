'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/lib/types';
import { MessageCircle, Eye, ShoppingCart, Calendar, Info } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5579991015150';

  const images = vehicle.fotos && vehicle.fotos.length > 0
    ? vehicle.fotos.sort((a: any, b: any) => a.position - b.position).map((f: any) => f.url)
    : ['/assets/placeholder-vehicle.jpg'];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no veículo:\n\n${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}\nPreço: R$ ${Number(vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nPoderia me dar mais informações?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:shadow-premium-hover hover:-translate-y-2">
      {/* Image Carousel */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {vehicle.promocao && (
            <div className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
              Promoção
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            {vehicle.tipo}
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black z-10 border border-white/10">
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
                    ? 'bg-white w-8'
                    : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white/40">
        <div className="space-y-1">
          <h3 className="font-heading text-xl sm:text-2xl font-black text-primary uppercase italic tracking-tighter leading-tight">
            {vehicle.marca} <span className="text-secondary">{vehicle.modelo}</span>
          </h3>
          <div className="flex items-center text-gray-400 space-x-2">
            <Calendar size={12} className="text-gray-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{vehicle.ano} • Seminovo Premium</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preço de Venda</p>
          <div className="flex items-baseline flex-wrap gap-1">
            <span className="text-sm sm:text-lg font-black text-primary">R$</span>
            <p className="text-xl sm:text-3xl font-heading font-black text-primary tracking-tighter">
              {Number(vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-3">
            <Link
              href={`/veiculos/${vehicle.id}`}
              className="flex-1 bg-white hover:bg-gray-50 text-primary border border-gray-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Info size={14} />
              <span>Detalhes</span>
            </Link>
            <button
              onClick={() => addToCart(vehicle)}
              className="flex-1 bg-primary hover:bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xl active:scale-95"
            >
              <ShoppingCart size={14} className="text-secondary" />
              <span>Reservar</span>
            </button>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-100 active:scale-95"
          >
            <MessageCircle size={16} />
            <span>Negociar via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
