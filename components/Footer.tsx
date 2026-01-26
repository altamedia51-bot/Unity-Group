import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#01040f] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm">U</div>
                <span className="text-xl font-bold text-white tracking-wide">UNITY GROUP</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Mitra terpercaya untuk solusi bisnis terintegrasi. Menghubungkan visi Anda dengan realitas kesuksesan melalui layanan profesional kelas dunia.
            </p>
            <div className="flex gap-4">
              {[Instagram, Linkedin, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-950 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Tautan Cepat</h4>
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
            <h4 className="text-white font-bold mb-6">Layanan</h4>
            <ul className="space-y-3">
              <li className="text-slate-500 text-sm">Legalitas Perusahaan</li>
              <li className="text-slate-500 text-sm">Travel Haji & Umroh</li>
              <li className="text-slate-500 text-sm">Properti Komersial</li>
              <li className="text-slate-500 text-sm">Digital Marketing</li>
              <li className="text-slate-500 text-sm">Konsultan Bisnis</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-yellow-500 mt-1 shrink-0" size={18} />
                <span className="text-slate-500 text-sm">Jl. Jendral Sudirman Kav. 52-53, SCBD, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-yellow-500 shrink-0" size={18} />
                <span className="text-slate-500 text-sm">info@unitygroup.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-yellow-500 shrink-0" size={18} />
                <span className="text-slate-500 text-sm">+62 21 5555 8888</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Unity Group. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-600 text-xs hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="text-slate-600 text-xs hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;