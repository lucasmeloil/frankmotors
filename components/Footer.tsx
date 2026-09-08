'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, ArrowRight, Heart, Award } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    { label: 'Início', path: '/' },
    { label: 'Nosso Catálogo', path: '/veiculos' },
    { label: 'Quem Somos', path: '/quem-somos' },
    { label: 'Fale Conosco', path: '/contato' },
    { label: 'Painel Admin', path: '/admin/login' },
  ];

  return (
    <footer className="bg-[#08080a] text-white relative overflow-hidden border-t border-red-900/30">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-800/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Info */}
          <div className="space-y-8 animate-slide-up">
            <Link href="/" className="inline-block group/footerlogo">
              <div className="relative w-64 h-16 transition-all duration-500 group-hover/footerlogo:scale-105">
                <Image
                  src="/assets/logo-cabocar.png"
                  alt="Cabo Car Multimarcas"
                  fill
                  sizes="256px"
                  className="object-contain object-left filter drop-shadow-[0_4px_16px_rgba(220,38,38,0.5)] group-hover/footerlogo:drop-shadow-[0_0_24px_rgba(239,68,68,0.8)] transition-all duration-500"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              <strong className="text-red-500">Cabo Car Multimarcas</strong> – Há mais de 20 anos realizando sonhos. Compra, venda, troca e financiamento de veículos com procedência e facilidade.
            </p>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-gray-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Fale conosco e dirija a excelência</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 border-l-2 border-red-600 pl-4">Navegação</h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 text-red-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Info */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 border-l-2 border-red-600 pl-4">Loja Física</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
                  <MapPin className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Localização</p>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Loja física em Salgado – SE</span>
                    <span className="text-gray-400 text-xs">Atendimento presencial e online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
                  <Clock className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Horário de Funcionamento</p>
                  <p className="text-xs font-bold text-gray-300">
                    Seg – Sex: 08h às 18h<br />Sáb: 08h às 13h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 border-l-2 border-red-600 pl-4">Contato Oficial</h3>
            <div className="space-y-4">
              <a 
                href="https://wa.me/55799999960149" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-4 group p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/10 transition-all border border-white/5 hover:border-red-600/30"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">WhatsApp & Vendas</p>
                  <p className="text-base font-black font-heading text-white italic tracking-tight">(79) 99999-60149</p>
                </div>
              </a>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Award size={13} className="text-red-500" /> Tradição & Confiança
                </p>
                <p className="text-xs text-gray-300">
                  Há mais de 20 anos realizando o sonho do veículo próprio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>© {new Date().getFullYear()} Cabo Car Multimarcas. Todos os direitos reservados.</p>
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full hidden md:block"></div>
            <p className="text-gray-500">Salgado – Sergipe</p>
          </div>
          <div className="flex items-center space-x-8">
            <span className="text-red-500/70 italic tracking-[0.3em]">DIRIJA A EXCELÊNCIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
