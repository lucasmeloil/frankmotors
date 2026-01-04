'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingCart, Trash2, Send, CreditCard, Landmark, Banknote, MapPin, User, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeFromCart, totalPrice, clearCart, totalItems } = useCart();
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    pagamento: 'PIX',
    troco: '',
  });

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Validation
    if (!formData.nome || !formData.endereco) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5579991015150';
    
    const lista_itens = items.map(item => `- ${item.vehicle.marca} ${item.vehicle.modelo} (${item.vehicle.ano}): R$ ${Number(item.vehicle.preco).toLocaleString('pt-BR')}`).join('\n');
    
    const valor_total = totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const troco_linha = formData.pagamento === 'Dinheiro' && formData.troco 
      ? `Preciso de troco para R$ ${formData.troco}` 
      : '';

    const message = `Olá, meu nome é ${formData.nome}. Quero reservar/comprar um veículo na Frank Motors.

Veículo:
${lista_itens}

Valor total: R$ ${valor_total}
Forma de pagamento: ${formData.pagamento}
${troco_linha}

Endereço de entrega/retirada:
${formData.endereco}

Obrigado!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose} 
      />
      
      {/* Drawer Content */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col animate-slide-in rounded-l-[3rem] overflow-hidden border-l border-white/20">
        
        {/* Header */}
        <div className="p-10 border-b border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-3xl font-black text-primary uppercase italic tracking-tighter">Minha <span className="text-secondary">Reserva</span></h2>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sessão Segura</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center animate-float">
                <ShoppingCart size={48} className="text-gray-200" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-primary uppercase italic">Nada por aqui</p>
                <p className="text-sm text-gray-400 font-medium max-w-[200px] mx-auto">
                  Sua lista de interesses está vazia. Adicione veículos para negociar.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/10 active:scale-95"
              >
                Voltar ao Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    Veículos Selecionados ({totalItems})
                  </h3>
                  <button onClick={clearCart} className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">Limpar</button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.vehicle.id} className="group p-5 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center space-x-6 hover:bg-white hover:shadow-premium transition-all duration-300">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <Image 
                          src={item.vehicle.fotos?.[0]?.url || '/assets/placeholder-vehicle.jpg'} 
                          alt={item.vehicle.modelo} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 overflow-hidden space-y-1">
                        <h4 className="font-black text-lg text-primary uppercase italic tracking-tighter leading-none group-hover:text-secondary transition-colors">
                          {item.vehicle.marca} <span className="font-normal opacity-60 text-primary">{item.vehicle.modelo}</span>
                        </h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.vehicle.ano} • {item.vehicle.tipo}</p>
                        <p className="text-xl font-black text-primary leading-none pt-1">
                          <span className="text-xs mr-0.5">R$</span> {Number(item.vehicle.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.vehicle.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-secondary hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-8 pt-10 border-t border-gray-100">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Dados Pessoais</h3>
                  <p className="text-[10px] font-medium text-gray-400">Preencha para agilizar seu atendimento</p>
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  <div className="relative group">
                    <User className="absolute left-5 top-5 text-gray-400 group-focus-within:text-secondary transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Nome Completo" 
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-[1.5rem] transition-all font-bold text-sm"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-5 text-gray-400 group-focus-within:text-secondary transition-colors" size={20} />
                    <textarea 
                      placeholder="Endereço ou Cidade" 
                      rows={2}
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-[1.5rem] transition-all font-bold text-sm resize-none"
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Forma de Pagamento Preferida</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'PIX', icon: Landmark },
                        { id: 'Cartão', icon: CreditCard },
                        { id: 'Dinheiro', icon: Banknote },
                        { id: 'Financiamento', icon: TrendingUp }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setFormData({...formData, pagamento: method.id})}
                          className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all group ${
                            formData.pagamento === method.id 
                              ? 'border-secondary bg-red-50 text-secondary' 
                              : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-primary'
                          }`}
                        >
                          <method.icon size={16} className={formData.pagamento === method.id ? 'animate-pulse' : ''} />
                          <span className="text-[11px] font-black uppercase tracking-widest">{method.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.pagamento === 'Dinheiro' && (
                    <div className="animate-slide-up bg-gray-50 p-6 rounded-3xl space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informação de Troco</p>
                      <input 
                        type="text" 
                        placeholder="Troco para quanto? (Ex: R$ 100,00)" 
                        className="w-full px-6 py-4 bg-white border border-gray-100 focus:ring-2 focus:ring-secondary/20 focus:border-secondary rounded-2xl transition-all font-bold text-sm"
                        value={formData.troco}
                        onChange={(e) => setFormData({...formData, troco: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Area */}
        {items.length > 0 && (
          <div className="p-10 bg-white border-t border-gray-100 space-y-6">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Estimado</span>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-black text-primary tracking-tighter italic uppercase leading-none">
                  <span className="text-xl mr-1 not-italic opacity-40">R$</span>
                  {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Preço Sugerido</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-between shadow-2xl shadow-green-100 transition-all transform hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
            >
              <span className="relative z-10">Confirmar via WhatsApp</span>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:translate-x-1">
                <ChevronRight size={20} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
            <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
              Consulte taxas e condições de financiamento com nossos vendedores.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// Add the icons that were missing
const TrendingUp = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
