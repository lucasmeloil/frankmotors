'use client';

import { Award, Shield, Users, MapPin, Heart, Star, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function QuemSomos() {
  const stats = [
    { label: "Veículos Entregues", value: "3.000+", icon: Star },
    { label: "Anos de Mercado", value: "20+", icon: Award },
    { label: "Clientes Satisfeitos", value: "100%", icon: Heart },
    { label: "Garantia de Procedência", value: "Sim", icon: Shield },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#0a0a0c] pt-20">
        <div className="absolute inset-0 z-0 opacity-20 carbon-pattern"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <span className="inline-block bg-red-600 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.3em] animate-fade-in shadow-md shadow-red-600/30">
            Nossa História
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter animate-slide-up">
            Cabo Car <span className="text-red-600">Multimarcas</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Há mais de 20 anos realizando sonhos. Compra, venda, troca e financiamento de veículos novos e seminovos em Salgado – SE.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-premium border border-gray-100 text-center space-y-3 group hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl font-black text-gray-950 italic">{stat.value}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-gray-950 uppercase italic leading-tight">
                  Tradição em <br />
                  <span className="text-red-600">Qualidade e Confiança</span>
                </h2>
                <div className="h-1.5 w-24 bg-red-600 rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                  Com mais de duas décadas de experiência e paixão pelo setor automotivo, a <strong>Cabo Car Multimarcas</strong> consolidou-se como referência em Salgado e em todo o estado de Sergipe.
                </p>
                <p>
                  Nossa atuação é fundamentada na integridade, excelência no atendimento e transparência total em cada negociação: compra, venda, troca com avaliação justa e financiamento com as principais financeiras do país.
                </p>
                <p className="italic font-bold text-red-600">
                  &quot;Fale conosco e dirija a excelência!&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {[
                  "Veículos 100% Periciados",
                  "Compra • Venda • Troca",
                  "Financiamento Facilitado",
                  "Loja Física em Salgado-SE"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-gray-950 font-bold">
                    <CheckCircle2 className="text-red-600" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative bg-[#0a0a0c] border border-red-600/30 p-6 flex flex-col justify-center items-center">
                <div className="relative w-full h-48 mb-6">
                  <Image 
                    src="/assets/banner-cabocar.png" 
                    alt="Cabo Car Multimarcas" 
                    fill 
                    className="object-cover rounded-2xl"
                  />
                </div>
                <div className="text-white text-center">
                  <p className="text-xs font-black uppercase tracking-[0.3em] mb-1 text-red-500">Loja Física</p>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin size={20} className="text-red-500" />
                    <span className="text-xl font-black italic">Salgado – Sergipe</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Award */}
              <div className="absolute -top-8 -right-4 md:-right-8 bg-white p-6 rounded-[2rem] shadow-premium border border-gray-100 hidden sm:block animate-bounce-slow">
                <div className="text-center">
                  <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-600/30">
                    <Star size={28} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Há mais de</p>
                  <p className="font-heading text-lg font-black text-gray-950 italic">20 Anos no Mercado</p>
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
            <h2 className="font-heading text-4xl md:text-6xl font-black text-gray-950 uppercase italic tracking-tighter">
              Venha fazer <br />
              <span className="text-red-600">parte dessa história</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium">
              Seu próximo veículo está esperando por você em nossa loja física em Salgado-SE.
            </p>
            <div className="pt-6">
              <Link 
                href="/veiculos" 
                className="bg-[#0a0a0c] hover:bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center space-x-3"
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
