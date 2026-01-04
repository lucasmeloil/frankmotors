'use client';

import { Phone, Mail, MapPin, MessageCircle, Clock, ChevronRight } from 'lucide-react';

export default function ContatoPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5579991015150';

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-gray-900 text-white py-12 mb-12">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
            Fale <span className="text-secondary font-normal">Conosco</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium max-w-xl">
            Tire suas dúvidas, solicite uma avaliação ou agende um test-drive premium.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-gray-100">
              <h2 className="font-heading text-2xl font-black text-primary uppercase italic mb-8 border-b border-gray-50 pb-6">
                Canais de <span className="text-secondary">Atendimento</span>
              </h2>

              <div className="space-y-6">
                {[
                  { icon: MessageCircle, color: "bg-green-600", label: "WhatsApp", value: "(79) 99101-5150", link: `https://wa.me/${whatsappNumber}` },
                  { icon: Phone, color: "bg-secondary", label: "Telefone", value: "(79) 99101-5150", link: "tel:+5579991015150" },
                  { icon: Mail, color: "bg-primary", label: "E-mail", value: "contato@frankmotors.com.br", link: "mailto:contato@frankmotors.com.br" },
                  { icon: MapPin, color: "bg-accent", label: "Endereço", value: "Lagarto, Sergipe", link: "https://www.google.com/maps/search/Frank+Motors+Lagarto+Sergipe" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target={item.link.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex items-center space-x-6 p-6 rounded-[2rem] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
                  >
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</h3>
                      <p className="font-bold text-lg text-primary">{item.value}</p>
                    </div>
                    <ChevronRight className="text-gray-200 group-hover:text-secondary transition-colors" size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-secondary to-red-800 text-white rounded-[3rem] shadow-2xl shadow-red-100 p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10 space-y-6">
                <h2 className="font-heading text-3xl font-black uppercase italic leading-tight">
                  Atendimento <br /> Personalizado
                </h2>
                <p className="text-white/80 font-medium leading-relaxed">
                  Não compre seu próximo veículo sem antes consultar as nossas condições. Cobrimos ofertas e garantimos a melhor taxa!
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de um atendimento personalizado para comprar um veículo.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-white text-secondary py-6 px-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl transform active:scale-95"
                >
                  Falar com Consultor
                </a>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <Clock className="text-secondary" size={24} />
                <h2 className="font-heading text-xl font-black text-primary uppercase italic">Horários</h2>
              </div>
              <div className="space-y-4">
                {[
                  { days: "Segunda a Sexta", hours: "08h às 18h" },
                  { days: "Sábado", hours: "08h às 14h" },
                  { days: "Domingo", hours: "Fechado" }
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-2xl ${i === 0 ? 'bg-gray-50' : ''}`}>
                    <span className="text-sm font-bold text-gray-500">{item.days}</span>
                    <span className="text-sm font-black text-primary uppercase tracking-widest">{item.hours}</span>
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
