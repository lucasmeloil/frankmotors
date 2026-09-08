'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck, Zap, TrendingUp, CheckCircle2, MessageCircle, MapPin, Award, Flame, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#060608] via-[#0d0d10] to-[#060608] pt-28 pb-10 sm:pt-32 sm:pb-16 min-h-[85vh] lg:min-h-screen flex items-center">
      {/* Background ambient lighting effects in red & dark carbon */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-red-800/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#dc262615_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">

        {/* MOBILE ONLY: Featured Badge Card at Top */}
        <div className="flex lg:hidden items-center justify-center gap-3.5 mb-4 animate-slide-up">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)] bg-black p-2 flex items-center justify-center">
            <Image
              src="/assets/logo-cabocar.png"
              alt="Cabo Car Multimarcas"
              fill
              className="object-contain p-1"
              priority
            />
          </div>

          <div className="bg-white text-gray-900 px-3.5 py-2 rounded-2xl rounded-bl-none shadow-xl border border-red-100 max-w-[230px]">
            <p className="text-[11px] font-black leading-tight flex items-center gap-1">
              <span>🚗</span> Há mais de 20 anos realizando sonhos
            </p>
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mt-0.5">
              Loja Física em Salgado-SE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">

          {/* Main Column: Headline, Brief Info & Call to Action Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-600/30 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-400">
                Salgado – SE • Compra • Venda • Troca • Financiamento
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.06] uppercase italic tracking-tight text-white">
                Fale Conosco e Dirija a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-white drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">
                  Excelência!
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-red-300 font-bold uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1.5">
                <Flame size={14} className="text-red-500 shrink-0" />
                <span>Há mais de 20 anos realizando sonhos com as melhores ofertas</span>
              </p>
            </div>

            {/* Breve Informação / Pitch */}
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Veículos 100% periciados, taxas exclusivas de financiamento e a melhor avaliação do seu seminovo na troca. Visite nossa loja física em Salgado-SE!
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-md mx-auto lg:mx-0 pt-0.5">
              {[
                "Aprovação Rápida",
                "Pegamos seu Usado",
                "100% Periciados"
              ].map((feat, i) => (
                <div key={i} className="flex items-center justify-center lg:justify-start space-x-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] sm:text-xs font-bold text-gray-200">
                  <CheckCircle2 size={13} className="text-red-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2 max-w-md mx-auto lg:mx-0">
              <Link
                href="/veiculos"
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 text-center"
              >
                <span>Ver Estoque Completo</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://wa.me/55799999960149?text=Ol%C3%A1%20Cabo%20Car%20Multimarcas!%20Gostaria%20de%20consultar%20os%20ve%C3%ADculos%20dispon%C3%ADveis%20e%20simular%20um%20financiamento."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/15 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:scale-105 active:scale-95 text-center"
              >
                <MessageCircle size={15} className="text-red-500" />
                <span>Simular no WhatsApp</span>
              </a>
            </div>

          </div>

          {/* DESKTOP ONLY: Prominent Visual Showcase */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">

              {/* Glowing Ambient Background Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-red-900/20 to-black/40 rounded-[2.5rem] blur-2xl animate-pulse" />

              {/* Floating Badge Top */}
              <div className="absolute -top-4 left-0 z-30 bg-white text-gray-950 px-4 py-2 rounded-2xl rounded-bl-none shadow-2xl border border-red-200 animate-bounce-slow">
                <p className="text-xs font-black leading-tight flex items-center gap-1.5">
                  <Flame size={14} className="text-red-600" /> &quot;Há mais de 20 anos realizando sonhos&quot;
                </p>
                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mt-0.5">
                  Cabo Car Multimarcas
                </span>
              </div>

              {/* Floating Location Badge Bottom */}
              <div className="absolute -bottom-4 right-0 z-30 bg-black/90 backdrop-blur-md border border-red-600/50 px-4 py-2.5 rounded-2xl text-left shadow-xl shadow-red-600/30">
                <div className="flex items-center space-x-2.5">
                  <MapPin className="text-red-500" size={18} />
                  <div>
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Loja Física</p>
                    <p className="text-xs font-black text-white">Salgado – Sergipe</p>
                  </div>
                </div>
              </div>

              {/* Showcase Banner Card */}
              <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden border-2 border-red-600/40 shadow-[0_0_40px_rgba(220,38,38,0.35)] bg-gradient-to-b from-[#141418] to-black p-4 flex flex-col items-center justify-center group">
                <div className="relative w-full h-4/5 rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/banner-cabocar.png"
                    alt="Cabo Car Multimarcas Oportunidades"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
                <div className="w-full pt-3 flex items-center justify-between text-white px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Ofertas Exclusivas</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Multimarcas</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Trust Badges Bar */}
        <div className="hidden md:grid md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          {[
            { icon: Zap, label: "Aprovação Rápida", sub: "Sem Burocracia" },
            { icon: ShieldCheck, label: "Garantia Total", sub: "100% Periciados" },
            { icon: TrendingUp, label: "Menores Parcelas", sub: "Financiamento Fácil" },
            { icon: Star, label: "Salgado - SE", sub: "20+ Anos de Excelência" }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-600/30 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all shrink-0">
                <item.icon size={17} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white">{item.label}</p>
                <p className="text-[10px] text-gray-400 font-bold">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
