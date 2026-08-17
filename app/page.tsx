import Hero from '@/components/Hero';
import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, Award, Shield, Clock, ThumbsUp } from 'lucide-react';


export const dynamic = 'force-dynamic';

import { getAllVehicles } from '@/lib/db-service';

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const all = await getAllVehicles(false);
    const available = all.filter(v => !v.status || v.status === 'disponivel');
    const promos = available.filter(v => v.promocao);
    const list = promos.length > 0 ? promos : available;
    return list.slice(0, 6) as Vehicle[];
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }
}

export default async function Home() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero />


            
            {/* Features Grid */}
      <section className="py-16 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-slide-up">
            {[
              { icon: Award, title: "Loja Destaque", desc: "Baby Motos Itabaiana", color: "bg-sky-500/10 text-sky-500" },
              { icon: Shield, title: "Garantia", desc: "Periciados e Revisados", color: "bg-blue-600/10 text-blue-600" },
              { icon: Clock, title: "Agilidade", desc: "Entrega Rápida", color: "bg-primary/10 text-primary" },
              { icon: ThumbsUp, title: "Confiança", desc: "100% Procedência", color: "bg-green-600/10 text-green-600" }
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-3xl transition-all duration-300 hover:bg-sky-50/50 hover:shadow-premium border border-transparent hover:border-sky-100 text-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 mb-4 md:mb-6 shadow-sm`}>
                  <feature.icon size={32} className="md:w-9 md:h-9" />
                </div>
                <h3 className="font-heading font-black text-primary uppercase text-xs md:text-sm tracking-widest">{feature.title}</h3>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-2 uppercase">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div className="animate-slide-up">
              <span className="text-sky-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Nosso Catálogo</span>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-primary uppercase italic">
                Destaques <span className="text-gray-400 font-normal">da Semana</span>
              </h2>
            </div>
            <Link
              href="/veiculos"
              className="hidden md:flex items-center space-x-3 text-primary hover:text-sky-500 font-black tracking-widest uppercase text-xs transition-all group animate-slide-up"
            >
              <span>Explorar Todos</span>
              <div className="p-2 bg-primary group-hover:bg-sky-500 rounded-full transition-colors">
                <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-premium border border-gray-100 italic text-gray-400 font-medium">
              Estamos preparando novas ofertas incríveis para você. Volte em breve!
            </div>
          )}

          <div className="text-center md:hidden">
            <Link
              href="/veiculos"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
            <span className="inline-block bg-white/10 backdrop-blur-sm border border-sky-400/30 text-sky-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">Atendimento Premium</span>
            <h2 className="font-heading text-4xl md:text-6xl font-black leading-tight text-white uppercase italic">
              Não compre seu próximo veículo sem <span className="text-sky-400 underline decoration-4 underline-offset-8">nos consultar!</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed font-medium">
              Temos condições exclusivas e o atendimento que você merece na Baby Motos. Fale agora mesmo com nossa equipe.
            </p>
            <div className="pt-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5579999070264'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl shadow-sky-500/40 transform hover:scale-105 active:scale-95 group"
              >
                <span>Chamar no WhatsApp</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
