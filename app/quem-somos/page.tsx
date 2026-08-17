'use client';

import { Award, Shield, Users, MapPin, Heart, Star, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function QuemSomos() {
  const stats = [
    { label: "Veículos Vendidos", value: "2.500+", icon: Star },
    { label: "Anos de Mercado", value: "10+", icon: Award },
    { label: "Clientes Satisfeitos", value: "100%", icon: Heart },
    { label: "Garantia de Procedência", value: "Sim", icon: Shield },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-primary pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/hero-1.png" 
            alt="Baby Motos Background" 
            fill 
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-white"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <span className="inline-block bg-sky-500 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.3em] animate-fade-in shadow-md shadow-sky-500/30">
            Nossa História
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter animate-slide-up">
            Baby <span className="text-sky-400">Motos</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Compra • Vende • Troca - Motos e Veículos Novos e Usados com procedência e facilidade em Itabaiana - SE.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-premium border border-gray-50 text-center space-y-3 group hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl font-black text-primary italic">{stat.value}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-primary uppercase italic leading-tight">
                  Referência em <br />
                  <span className="text-sky-500">Qualidade e Confiança</span>
                </h2>
                <div className="h-1.5 w-24 bg-sky-500 rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Especializada no segmento de motos e veículos novos e usados, a <strong>Baby Motos</strong> destaca-se pela excelência em compra, venda e troca com as melhores taxas do mercado. 
                </p>
                <p>
                  Nossa missão em Itabaiana, Sergipe, é proporcionar uma experiência segura e transparente, garantindo procedência periciada e total satisfação aos nossos clientes.
                </p>
                <p className="italic font-bold text-sky-600">
                  &quot;DEUS é bom o tempo todo 🙏🏼🙌🏼&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {[
                  "Veículos Periciados",
                  "Compra • Vende • Troca",
                  "Motos Novas e Usadas",
                  "Atendimento VIP"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-primary font-bold">
                    <CheckCircle2 className="text-sky-500" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                <Image 
                  src="/assets/hero-2.png" 
                  alt="Showroom Baby Motos" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.3em] mb-2">Showroom Baby Motos</p>
                  <div className="flex items-center space-x-2">
                    <MapPin size={20} className="text-sky-400" />
                    <span className="text-xl font-black italic">Itabaiana – Sergipe</span>
                  </div>
                </div>
              </div>
              {/* Floating Award */}
              <div className="absolute -top-10 -right-10 bg-white p-8 rounded-[2rem] shadow-premium border border-gray-100 hidden md:block animate-bounce-slow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
                    <Star size={32} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Loja Destaque</p>
                  <p className="font-heading text-xl font-black text-primary italic">Baby Motos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="font-heading text-4xl md:text-6xl font-black text-primary uppercase italic tracking-tighter">
              Venha fazer <br />
              <span className="text-secondary">parte dessa história</span>
            </h2>
            <p className="text-gray-500 text-xl font-medium">
              Sua próxima conquista premium está esperando por você em nosso showroom. 
            </p>
            <div className="pt-6">
              <Link 
                href="/veiculos" 
                className="bg-primary hover:bg-secondary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center space-x-3"
              >
                <span>Explorar Catálogo</span>
                <Users size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
