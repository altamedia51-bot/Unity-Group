
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, Eye, Lock } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useContent } from '../contexts/ContentContext';

interface FooterProps {
    onNavigate: (view: 'landing' | 'login') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { content, visitorCount, onlineCount } = useContent();

  const socialLinks = [
    { icon: Instagram, href: content.socialMedia?.instagram },
    { icon: Linkedin, href: content.socialMedia?.linkedin },
    { icon: Facebook, href: content.socialMedia?.facebook },
    { icon: Twitter, href: content.socialMedia?.twitter },
  ];

  return (
    <footer id="footer" className="bg-[#01040f] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div>
            <div className="mb-6 flex items-center gap-3">
                 {/* Logo Footer Bigger */}
                 <img 
                    src={content.logoUrl} 
                    alt="Unity Group" 
                    className="h-14 w-auto object-contain" 
                />
                <span className="font-serif font-bold text-xl text-yellow-500 tracking-wider">UNITY GROUP</span>
            </div>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Mitra terpercaya untuk solusi bisnis terintegrasi. Menghubungkan visi Anda dengan realitas kesuksesan melalui layanan profesional kelas dunia.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((item, i) => (
                item.href ? (
                    <a 
                        key={i} 
                        href={item.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-950 transition-all duration-300"
                    >
                        <item.icon size={18} />
                    </a>
                ) : null
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 tracking-wide">Tautan Cepat</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-500 text-sm hover:text-yellow-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li><a href="#" className="text-slate-500 text-sm hover:text-yellow-400 transition-colors">Karir</a></li>
              <li><a href="#" className="text-slate-500 text-sm hover:text-yellow-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 tracking-wide">Layanan</h4>
            <ul className="space-y-3">
              {content.services.map(s => (
                <li key={s.id} className="text-slate-500 text-sm">{s.title}</li>
              ))}
            </ul>
          </div>

          {/* Contact - DYNAMIC */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 tracking-wide">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-yellow-500 mt-1 shrink-0" size={18} />
                <span className="text-slate-500 text-sm">{content.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-yellow-500 shrink-0" size={18} />
                <span className="text-slate-500 text-sm">{content.contact.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-yellow-500 shrink-0" size={18} />
                <span className="text-slate-500 text-sm">{content.contact.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs order-2 md:order-1 flex items-center gap-2">
            © {new Date().getFullYear()} Unity Group. All rights reserved.
            {/* Hidden Admin Link */}
            <button 
                onClick={() => onNavigate('login')}
                className="opacity-10 hover:opacity-100 transition-opacity p-1"
                title="Admin Login"
            >
                <Lock size={10} />
            </button>
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 order-1 md:order-2">
            
            {/* STATS BADGES */}
            <div className="flex items-center gap-4">
                
                {/* Total Visitors */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-500 text-xs shadow-inner">
                      <Eye size={12} className="text-slate-400" />
                      <span>Total: <span className="text-slate-300 font-mono font-bold">{visitorCount > 0 ? visitorCount.toLocaleString() : '...'}</span></span>
                </div>

                {/* Online Visitors - Live Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-slate-500 text-xs shadow-inner relative overflow-hidden">
                      {/* Pulse Effect */}
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      
                      <span className="flex items-center gap-1">
                        Online: <span className="text-green-400 font-mono font-bold">{onlineCount}</span>
                      </span>
                </div>

            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
