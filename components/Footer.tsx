'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    { label: 'Início', path: '/' },
    { label: 'Nosso Catálogo', path: '/veiculos' },
    { label: 'Promoções do Mês', path: '/promocoes' },
    { label: 'Fale Conosco', path: '/contato' },
    { label: 'Painel Admin', path: '/admin/login' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/frankmotors', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' },
    { icon: Facebook, href: 'https://facebook.com/frankmotors', color: 'bg-[#1877F2]' },
  ];

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Info */}
          <div className="space-y-8 animate-slide-up">
            <Link href="/" className="inline-block group">
              <div className="w-32 h-32 bg-transparent flex items-center justify-center transition-transform group-hover:scale-105">
                <Image 
                  src="/assets/logo-3d.png" 
                  alt="Frank Motors" 
                  width={128} 
                  height={128} 
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Especialistas em realizar sonhos. Oferecemos as melhores condições para compra, venda e financiamento de veículos novos e seminovos em Lagarto e região.
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
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-l-2 border-secondary pl-4">Navegação</h3>
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
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-l-2 border-secondary pl-4">Showroom</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <MapPin className="text-secondary" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Localização</p>
                  <p className="text-sm font-bold text-gray-300 leading-relaxed">
                    Lagarto – Sergipe
                  </p>
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
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-l-2 border-secondary pl-4">Atendimento</h3>
            <div className="space-y-6">
              <a href="tel:+5579991015150" className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center shadow-xl shadow-red-900/40 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Ligar Agora</p>
                  <p className="text-lg font-black font-heading text-white italic tracking-tighter">(79) 99101-5150</p>
                </div>
              </a>
              <a href="mailto:contato@frankmotors.com.br" className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-white/5 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">E-mail</p>
                  <p className="text-sm font-bold text-gray-300">contato@frankmotors.com.br</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>© {new Date().getFullYear()} Frank Motors.</p>
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full hidden md:block"></div>
            <p className="text-gray-600">Desenvolvido com <Heart size={10} className="inline text-secondary mx-0.5" /> para Excelência.</p>
          </div>
          <div className="flex items-center space-x-8">
            <span className="text-gray-700 italic tracking-[0.3em]">DEUS É BOM O TEMPO TODO 🙏🏼</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
