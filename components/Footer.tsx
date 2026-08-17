'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    { label: 'Início', path: '/' },
    { label: 'Nosso Catálogo', path: '/veiculos' },
    { label: 'Quem Somos', path: '/quem-somos' },
    { label: 'Fale Conosco', path: '/contato' },
    { label: 'Painel Admin', path: '/admin/login' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/babymotoss/', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' },
  ];

  return (
    <footer className="bg-[#06101e] text-white relative overflow-hidden border-t border-sky-900/30">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Info */}
          <div className="space-y-8 animate-slide-up">
            <Link href="/" className="inline-block group/footerlogo">
              <div className="relative w-60 h-20 transition-all duration-500 group-hover/footerlogo:scale-105">
                <Image
                  src="/assets/logo-babymotos-transparent.png"
                  alt="Baby Motos"
                  fill
                  sizes="240px"
                  className="object-contain object-left filter drop-shadow-[0_4px_16px_rgba(0,153,255,0.5)] group-hover/footerlogo:drop-shadow-[0_0_24px_rgba(0,166,255,0.9)] transition-all duration-500"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              <strong className="text-sky-400">Baby Motos</strong> – Compra • Vende • Troca. As melhores ofertas em motos e veículos novos e usados com garantia de procedência e facilidade no financiamento.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 ${social.color} text-white rounded-xl flex items-center justify-center transition-all transform hover:scale-110 hover:-rotate-6 shadow-lg`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400 border-l-2 border-secondary pl-4">Navegação</h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Info */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400 border-l-2 border-secondary pl-4">Showroom</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <MapPin className="text-secondary" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Localização</p>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Itabaiana – Sergipe</span>
                    <span className="text-gray-400 text-xs">Atendimento em toda a região</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Clock className="text-secondary" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Escritório</p>
                  <p className="text-xs font-bold text-gray-300">
                    Seg – Sex: 08h às 18h<br />Sáb: 08h às 12h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400 border-l-2 border-secondary pl-4">Contatos & WhatsApp</h3>
            <div className="space-y-4">
              {/* Baby */}
              <a href="https://wa.me/5579999070264" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group p-3 rounded-2xl hover:bg-white/5 transition-all">
                <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest leading-none mb-1">Baby</p>
                  <p className="text-base font-black font-heading text-white italic tracking-tight">(79) 99907-0264</p>
                </div>
              </a>

              {/* Boniek */}
              <a href="https://wa.me/5579999740934" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group p-3 rounded-2xl hover:bg-white/5 transition-all">
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Boniek</p>
                  <p className="text-base font-black font-heading text-white italic tracking-tight">(79) 99974-0934</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>© {new Date().getFullYear()} Baby Motos. Todos os direitos reservados.</p>
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full hidden md:block"></div>
            <p className="text-gray-600">Desenvolvido com <Heart size={10} className="inline text-secondary mx-0.5" /> para Excelência.</p>
          </div>
          <div className="flex items-center space-x-8">
            <span className="text-sky-500/70 italic tracking-[0.3em]">DEUS É BOM O TEMPO TODO 🙏🏼</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
