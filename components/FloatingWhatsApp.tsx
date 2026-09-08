'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Clock, Send, Phone } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(true);

  const contacts = [
    {
      name: 'Cabo Car Multimarcas',
      role: 'Atendimento, Trocas & Financiamento',
      phone: '(79) 99999-60149',
      number: '55799999960149',
      avatarColor: 'from-red-600 to-black'
    }
  ];

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      if (day >= 1 && day <= 5) {
        setIsBusinessHours(hour >= 8 && hour < 18);
      } else if (day === 6) {
        setIsBusinessHours(hour >= 8 && hour < 13);
      } else {
        setIsBusinessHours(false);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = (number: string, name: string) => {
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre os veículos disponíveis na Cabo Car Multimarcas.`);
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-8 md:right-8">
      {/* Tooltip / Modal */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-84 sm:w-96 glass-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up transform origin-bottom-right border border-red-100 bg-white">
          <div className="bg-gradient-to-r from-red-600 to-black p-6 text-white relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-md border border-white/10">
                <MessageCircle size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-base leading-tight text-white uppercase tracking-wider">Cabo Car Multimarcas</h3>
                <div className="flex items-center space-x-1.5 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-emerald-400 animate-pulse' : 'bg-orange-300'}`}></div>
                  <span className="text-xs font-bold text-white/90">
                    {isBusinessHours ? 'Atendimento Aberto' : 'Plantão Online'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Fale diretamente conosco:
            </p>

            <div className="space-y-3">
              {contacts.map((contact) => (
                <button
                  key={contact.name}
                  onClick={() => handleWhatsAppClick(contact.number, contact.name)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-red-50/50 transition-all border border-gray-100 hover:border-red-200 group text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${contact.avatarColor} text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform text-sm`}>
                      CC
                    </div>
                    <div>
                      <p className="font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors">{contact.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <span>Iniciar</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400 font-bold border-t border-gray-100">
              <span className="flex items-center gap-1"><Clock size={12} /> Seg–Sex: 08h às 18h | Sáb: 08h às 13h</span>
              <span className="text-red-600 font-black">Salgado – SE</span>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-90 shadow-red-600/40 border border-white/20"
        title="Falar pelo WhatsApp"
      >
        <span className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-25 group-hover:hidden"></span>
        <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>
    </div>
  );
}
