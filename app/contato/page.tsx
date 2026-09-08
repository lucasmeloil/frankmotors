'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, ChevronRight, Send } from 'lucide-react';

export default function ContatoPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '55799999960149';
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a0a0c] via-[#141418] to-black text-white py-16 md:py-20 mb-12 relative overflow-hidden border-b border-red-600/20">
        <div className="absolute inset-0 carbon-pattern opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center md:text-left relative z-10">
          <span className="text-red-500 font-black text-xs uppercase tracking-widest block mb-2">Loja Física em Salgado – SE</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4 break-words">
            Fale <span className="text-red-600 font-normal">Conosco</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-sm md:text-base leading-relaxed text-balance">
            Há mais de 20 anos realizando sonhos. Tire suas dúvidas, simule seu financiamento ou agende uma visita à nossa loja.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column: Channels & Map */}
          <div className="space-y-8">
            {/* Channels */}
            <div className="bg-white rounded-[2.5rem] shadow-premium p-6 sm:p-8 md:p-10 border border-gray-100">
              <h2 className="font-heading text-xl md:text-2xl font-black text-gray-950 uppercase italic mb-8 border-b border-gray-100 pb-6">
                Canais de <span className="text-red-600">Atendimento</span>
              </h2>

              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: MessageCircle, color: "bg-red-600", label: "WhatsApp Oficial & Vendas", value: "(79) 99999-60149", link: "https://wa.me/55799999960149" },
                  { icon: MapPin, color: "bg-[#0a0a0c]", label: "Loja Física", value: "Salgado – Sergipe", link: "https://maps.google.com/?q=Salgado+Sergipe" },
                  { icon: Mail, color: "bg-gray-800", label: "E-mail Oficial", value: "contato@cabocarmultimarcas.com.br", link: "mailto:contato@cabocarmultimarcas.com.br" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target={item.link.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-5 rounded-[2rem] hover:bg-red-50/50 transition-all group border border-transparent hover:border-red-100"
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform text-white`}>
                      <item.icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{item.label}</h3>
                      <p className="font-bold text-sm sm:text-lg text-gray-950 truncate">{item.value}</p>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-red-600 transition-colors flex-shrink-0" size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-gray-100 h-80 relative group">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62635.808035310864!2d-37.5186036!3d-11.0313177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x70ff5021e1d0337%3A0x6fbcaeb65eead13f!2sSalgado%20-%20SE!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-red-600/30 pointer-events-none">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-red-500" />
                  <span className="text-xs font-black text-white uppercase">Salgado – SE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Message & Hours */}
          <div className="space-y-8">
            {/* Quick Message Form */}
             <div className="bg-gradient-to-br from-[#0a0a0c] to-[#18181c] text-white rounded-[2.5rem] shadow-2xl shadow-red-950/20 p-8 sm:p-10 relative overflow-hidden border border-red-600/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-black uppercase italic leading-tight mb-2">
                    Mensagem Rápida
                  </h2>
                  <p className="text-gray-300 font-medium text-sm leading-relaxed text-balance">
                    Envie uma mensagem direta para a Cabo Car Multimarcas agora mesmo.
                  </p>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-4">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Olá, gostaria de consultar as opções de veículos disponíveis na Cabo Car Multimarcas..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-red-500 transition-all resize-none text-sm font-medium"
                  ></textarea>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    <span>Enviar WhatsApp</span>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-[2.5rem] shadow-premium p-8 sm:p-10 border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <Clock className="text-red-600" size={24} />
                <h2 className="font-heading text-xl font-black text-gray-950 uppercase italic">Horários</h2>
              </div>
              <div className="space-y-4">
                {[
                  { days: "Segunda a Sexta", hours: "08h às 18h" },
                  { days: "Sábado", hours: "08h às 13h" },
                  { days: "Domingo", hours: "Plantão Online" }
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-2xl ${i === 0 ? 'bg-red-50/50' : ''}`}>
                    <span className="text-sm font-bold text-gray-600">{item.days}</span>
                    <span className="text-sm font-black text-gray-950 uppercase tracking-widest">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
