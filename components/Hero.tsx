'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: '/assets/hero-1.png',
    title: 'Sua próxima\nconquista está aqui',
    highlight: 'conquista',
    subtitle: 'Experiência de compra inigualável com garantia de procedência.',
  },
  {
    image: '/assets/hero-2.png',
    title: 'Performance e\nLuxo sem limites',
    highlight: 'Performance',
    subtitle: 'Os melhores veículos premium de Lagarto e região.',
  },
  {
    image: '/assets/hero-3.png',
    title: 'Onde seus sonhos\nganham vida',
    highlight: 'sonhos',
    subtitle: 'Atendimento exclusivo e entrega em tempo recorde.',
  }
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-[90vh] sm:h-screen min-h-[600px] w-full overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover transition-transform duration-[10000ms] ${
                  index === activeIndex ? 'scale-110' : 'scale-100'
                }`}
                priority={index === 0}
              />
              {/* Dark Overlays - Stronger on mobile for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 md:via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 md:to-black/40"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-20">
              <div className="max-w-4xl space-y-6 md:space-y-8 mt-12 md:mt-0">
                {/* Badge - Responsive padding */}
                <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 px-4 md:px-6 py-2 rounded-full">
                  <div className="flex items-center -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-primary overflow-hidden bg-gray-800 flex items-center justify-center">
                        <Star size={8} className="text-secondary md:hidden" />
                        <Star size={10} className="text-secondary hidden md:block" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    Loja Destaque <span className="text-accent">2024 & 2025</span>
                  </span>
                </div>

                {/* Headline - Responsive Font Sizes and Line Heights */}
                <div className="space-y-4">
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-8xl font-black leading-[1.1] md:leading-[0.95] uppercase italic tracking-tighter text-white whitespace-pre-line">
                    {slide.title.split(slide.highlight)[0]}
                    <span className="text-secondary italic underline decoration-white/20">{slide.highlight}</span>
                    {slide.title.split(slide.highlight)[1]}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="h-px w-8 md:w-12 bg-secondary"></div>
                    <p className="text-[10px] md:text-lg text-gray-400 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">Frank Motors Premium</p>
                  </div>
                </div>

                {/* Subtext - More compact on mobile */}
                <p className="text-base md:text-xl text-gray-300 font-medium leading-relaxed max-w-xl balance-text">
                  {slide.subtitle}
                </p>

                {/* Buttons - Mobile Full Width Stack */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
                  <Link
                    href="/veiculos"
                    className="w-full sm:w-auto bg-secondary hover:bg-red-700 text-white px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:scale-105 active:scale-95 group"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>
                  <Link
                    href="/contato"
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/20 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
                  >
                    Falar Conosco
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Display - Adjusted visibility/scale for mobile */}
      <div className="absolute bottom-20 sm:bottom-16 right-6 sm:right-12 z-30 flex flex-col items-end">
        <div className="font-heading font-black text-xl md:text-2xl text-white italic">
          0{activeIndex + 1} <span className="text-gray-600 text-[10px] md:text-sm">/ 0{slides.length}</span>
        </div>
        <div className="w-16 md:w-24 h-1 bg-white/10 mt-1 md:mt-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all"
            style={{ 
              width: `${((activeIndex + 1) / slides.length) * 100}%`,
              transitionDuration: '500ms'
            }}
          ></div>
        </div>
      </div>

      {/* Trust Bars */}
      <div className="absolute bottom-0 left-0 w-full z-20 py-4 md:py-8 bg-gradient-to-t from-black to-transparent">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex lg:grid lg:grid-cols-4 gap-6 md:gap-8 min-w-max lg:min-w-0">
            {[
              { icon: Zap, label: "24/48h", sub: "Entrega Ágil" },
              { icon: ShieldCheck, label: "Periciados", sub: "100% Seguro" },
              { icon: TrendingUp, label: "Melhor Taxa", sub: "Financiamento" },
              { icon: Star, label: "5 Estrelas", sub: "Avaliação Google" }
            ].map((item, i) => (
              <div key={i} className="flex lg:flex items-center space-x-3 md:space-x-4 group opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                  <item.icon size={16} className="md:size-20" />
                </div>
                <div>
                  <p className="text-[12px] md:text-sm font-black italic uppercase leading-none text-white">{item.label}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .balance-text {
          text-wrap: balance;
        }
      `}</style>
    </section>
  );
}
