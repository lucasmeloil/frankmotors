'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Clock, Send } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(true);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5579991015150';

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      
      // Monday to Friday: 08:00 to 18:00
      // Saturday: 08:00 to 12:00
      // Sunday: closed
      if (day >= 1 && day <= 5) {
        setIsBusinessHours(hour >= 8 && hour < 18);
      } else if (day === 6) {
        setIsBusinessHours(hour >= 8 && hour < 12);
      } else {
        setIsBusinessHours(false);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os veículos disponíveis.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-8 md:right-8">
      {/* Tooltip / Modal */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 glass-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up transform origin-bottom-right">
          <div className="bg-green-600 p-6 text-white relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">Atendimento Online</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-green-300 animate-pulse' : 'bg-orange-300'}`}></div>
                  <span className="text-xs font-medium text-white/90">
                    {isBusinessHours ? 'Estamos atendendo!' : 'Aguarde nosso retorno'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white/50 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Clock size={16} />
                <span className="font-semibold uppercase tracking-widest text-[10px]">Horários</span>
              </div>
              <div className="text-xs text-gray-600 font-medium space-y-1">
                <p>Seg - Sex: 08h às 18h</p>
                <p>Sáb: 08h às 12h</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-sm text-gray-600">
              {isBusinessHours 
                ? "Olá! Estamos prontos para te atender. Como podemos ajudar hoje?"
                : "No momento estamos fora do horário comercial, mas deixe sua mensagem e responderemos o mais breve possível! 🙏"}
            </div>

            <button 
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-100 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <Send size={18} />
              <span>ENVIAR MENSAGEM</span>
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-90 hover:rotate-6 shadow-green-200/50"
      >
        <span className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-25 group-hover:hidden"></span>
        <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
        
        {/* Counter Badge if needed, but here we can just show a notification dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
}
