'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck, Zap, TrendingUp, CheckCircle2, MessageCircle, Phone, Award, Flame, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#040914] via-[#071120] to-[#040711] pt-28 pb-10 sm:pt-32 sm:pb-16 min-h-[85vh] lg:min-h-screen flex items-center">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#00a6ff0f_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">

        {/* MOBILE ONLY: Featured Mascot Card at Top */}
        <div className="flex lg:hidden items-center justify-center gap-3.5 mb-4 animate-slide-up">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.4)] bg-gradient-to-b from-sky-900/60 to-black p-0.5">
            <Image
              src="/assets/mascote-babymotos.png"
              alt="Mascote Baby Motos"
              fill
              className="object-cover rounded-[0.9rem]"
              priority
            />
            <div className="absolute bottom-0 inset-x-0 bg-sky-500/90 text-white text-[8px] font-black uppercase tracking-wider text-center py-0.5">
              Baby Motos
            </div>
          </div>

          <div className="bg-white text-gray-900 px-3.5 py-2 rounded-2xl rounded-bl-none shadow-xl border border-sky-200 max-w-[210px]">
            <p className="text-[11px] font-black leading-tight flex items-center gap-1">
              <span>👋</span> &quot;Bora realizar o sonho da sua moto hoje?&quot;
            </p>
            <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest block mt-0.5">
              Mascote Oficial
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">

          {/* Main Column: Headline, Brief Info & Call to Action Buttons */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 text-center lg:text-left">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-400/30 px-3.5 py-1 rounded-full shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-sky-300">
                Itabaiana – SE • Compra • Vende • Troca
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] uppercase italic tracking-tight text-white">
                Sua Moto Nova com as{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                  Melhores Taxas!
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-sky-200 font-bold uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
                <Flame size={13} className="text-amber-400 shrink-0" />
                Honda CG 160 Titan • Biz 125 • Pop 110i
              </p>
            </div>

            {/* Breve Informação / Pitch */}
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Motos 100% periciadas e financiamento aprovado na hora com as menores parcelas de Sergipe.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-md mx-auto lg:mx-0 pt-0.5">
              {[
                "Aprovação Fácil",
                "Pegamos Usada",
                "100% Periciada"
              ].map((feat, i) => (
                <div key={i} className="flex items-center justify-center lg:justify-start space-x-1 p-1.5 sm:p-2 rounded-xl bg-white/[0.05] border border-white/10 text-[10px] sm:text-xs font-bold text-gray-200">
                  <CheckCircle2 size={12} className="text-sky-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2 max-w-md mx-auto lg:mx-0">
              <Link
                href="/veiculos"
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-5 py-3 sm:py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 text-center"
              >
                <span>Ver Motos em Estoque</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://wa.me/5579999070264?text=Ol%C3%A1%20Baby%20Motos!%20Gostaria%20de%20simular%20um%20financiamento%20e%20ver%20as%20motos%20dispon%C3%ADveis."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white px-5 py-3 sm:py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 text-center"
              >
                <MessageCircle size={15} />
                <span>Simular no WhatsApp</span>
              </a>
            </div>

          </div>

          {/* DESKTOP ONLY: Prominent 3D Mascot Showcase */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">

              {/* Glowing Ambient Background Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 via-cyan-400/20 to-blue-600/30 rounded-[3rem] blur-2xl animate-pulse" />

              {/* Floating Speech Bubble from Mascot */}
              <div className="absolute -top-4 left-2 z-30 bg-white text-gray-900 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-2xl border border-sky-100 max-w-[220px] animate-bounce-slow">
                <p className="text-xs font-black leading-tight flex items-center gap-1">
                  <span>👋</span> &quot;Bora realizar o sonho da sua moto hoje?&quot;
                </p>
                <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest block mt-0.5">

                </span>
              </div>

              {/* Floating Stats Badge */}
              <div className="absolute -bottom-3 right-0 z-30 bg-black/90 backdrop-blur-md border border-sky-500/40 px-4 py-2.5 rounded-2xl text-left shadow-xl shadow-sky-500/30">
                <div className="flex items-center space-x-2.5">
                  <Award className="text-amber-400" size={18} />
                  <div>
                    <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Loja Nº 1</p>
                    <p className="text-xs font-black text-white">Itabaiana – Sergipe</p>
                  </div>
                </div>
              </div>

              {/* Mascot 3D Image Card */}
              <div className="relative w-full h-full rounded-[2.8rem] overflow-hidden border-2 border-sky-400/50 shadow-[0_0_40px_rgba(56,189,248,0.35)] bg-gradient-to-b from-sky-950/40 to-black p-2">
                <Image
                  src="/assets/mascote-babymotos.png"
                  alt="Mascote Baby Motos"
                  fill
                  className="object-cover rounded-[2.4rem] filter drop-shadow-[0_15px_30px_rgba(0,166,255,0.4)]"
                  priority
                />
              </div>

            </div>
          </div>

        </div>

        {/* Trust Badges Bar - Hidden on mobile to keep 100% viewport clean, visible on tablet/desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          {[
            { icon: Zap, label: "Aprovação Rápida", sub: "Sem Burocracia" },
            { icon: ShieldCheck, label: "Garantia Total", sub: "100% Periciadas" },
            { icon: TrendingUp, label: "Menores Parcelas", sub: "Financiamento Fácil" },
            { icon: Star, label: "Itabaiana - SE", sub: "Referência Regional" }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-sky-500/30 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all shrink-0">
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
