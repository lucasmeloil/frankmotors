import Hero from '@/components/Hero';
import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, Award, Shield, Clock, ThumbsUp } from 'lucide-react';
import { mockVehicles } from '@/lib/mockVehicles';

export const dynamic = 'force-dynamic';

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // During build or if server is not up, this might fail
    const res = await fetch(`${baseUrl}/api/vehicles?pageSize=3`, {
      next: { revalidate: 3600 } // Use ISR instead of no-store to allow build to continue
    }).catch(() => null);
    
    if (!res || !res.ok) {
      console.warn('API fetch failed, using mock data as fallback');
      return mockVehicles.slice(0, 3);
    }
    
    const data = await res.json();
    return data.vehicles || mockVehicles.slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    return mockVehicles.slice(0, 3);
  }
}

export default async function Home() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero />

      {/* About Section - Premium Card */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-16">
            {/* Card 1: Identity & Brand Power */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-white border border-gray-100 group hover:shadow-premium hover:-translate-y-1 transition-all duration-500 flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[350px]">
              <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="space-y-6 animate-slide-up relative z-10">
                <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-primary leading-[0.9] uppercase italic tracking-tighter transform group-hover:scale-105 transition-transform duration-500">
                  Frank <span className="text-secondary">Motors</span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-400 text-4xl md:text-5xl lg:text-6xl block mt-2">Excelência</span>
                  <span className="text-gray-300 text-4xl md:text-5xl lg:text-6xl block">em cada KM</span>
                </h2>
                <div className="flex justify-center">
                  <div className="h-1.5 w-24 bg-secondary rounded-full shadow-[0_0_15px_rgba(230,0,0,0.4)] group-hover:w-40 transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Card 2: Credentials & Trust */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 group hover:shadow-premium hover:-translate-y-1 transition-all duration-500 flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[350px]">
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-8 w-full animate-slide-up relative z-10" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 px-6 py-4 rounded-2xl shadow-sm flex items-center justify-center gap-3 transform group-hover:scale-105 transition-all duration-300 hover:shadow-md hover:border-secondary/20 hover:bg-white">
                      <span className="font-bold text-gray-700 text-sm md:text-base">Loja Destaque 2024/25</span>
                      <span className="text-2xl animate-pulse">🏆</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 px-6 py-4 rounded-2xl shadow-sm flex items-center justify-center gap-3 transform group-hover:scale-105 transition-all duration-300 delay-75 hover:shadow-md hover:border-secondary/20 hover:bg-white">
                      <span className="font-bold text-gray-700 text-sm md:text-base">DEUS é bom o tempo todo</span>
                      <span className="text-2xl">🙏🏼</span>
                    </div>
                </div>

                <p className="text-xl md:text-2xl font-heading font-black text-gray-800 leading-tight max-w-md mx-auto">
                  Referência em <span className="text-secondary decoration-4 underline-offset-4 decoration-secondary/10 group-hover:underline transition-all">Lagarto e região</span> para quem busca qualidade e transparência.
                </p>
              </div>
            </div>
          </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {[
                { icon: Award, title: "Loja Destaque", desc: "2024 e 2025", color: "bg-accent/10 text-accent" },
                { icon: Shield, title: "Garantia", desc: "Veículos Periciados", color: "bg-secondary/10 text-secondary" },
                { icon: Clock, title: "Rapidez", desc: "Entrega 24/48h", color: "bg-primary/10 text-primary" },
                { icon: ThumbsUp, title: "Confiança", desc: "100% Satisfeitos", color: "bg-green-600/10 text-green-600" }
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-premium border border-transparent hover:border-gray-100">
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
              <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Nosso Catálogo</span>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-primary uppercase italic">
                Destaques <span className="text-gray-400 font-normal">da Semana</span>
              </h2>
            </div>
            <Link
              href="/veiculos"
              className="hidden md:flex items-center space-x-3 text-primary hover:text-secondary font-black tracking-widest uppercase text-xs transition-all group animate-slide-up"
            >
              <span>Explorar Todos</span>
              <div className="p-2 bg-primary group-hover:bg-secondary rounded-full transition-colors">
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
            <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">Atendimento Premium</span>
            <h2 className="font-heading text-4xl md:text-6xl font-black leading-tight text-white uppercase italic">
              Não compre seu próximo veículo sem <span className="text-secondary underline decoration-4 underline-offset-8">nos consultar!</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed font-medium">
              Temos condições exclusivas e o atendimento que você merece. Fale agora mesmo com nossa equipe.
            </p>
            <div className="pt-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5579991015150'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-secondary hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl shadow-red-900/50 transform hover:scale-105 active:scale-95 group"
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
