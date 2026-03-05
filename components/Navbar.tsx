
import React, { useState, useEffect } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useContent } from '../contexts/ContentContext';
import { Button } from './Button';

interface NavbarProps {
    onNavigate: (view: 'landing' | 'login') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { content } = useContent(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'backdrop-blur-xl bg-slate-950/70 border-b border-white/5 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo Image + Text Unity Group */}
        <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => onNavigate('landing')}
        >
            {/* LOGO SIZE INCREASED: h-12 to h-14/16 */}
            <img 
                src={content.logoUrl} 
                alt="Unity Group" 
                className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            
            {/* FONT STYLE ADJUSTED: font-serif (Cinzel), text-2xl, wider tracking */}
            <div className="flex flex-col">
                <span className="font-serif font-bold text-xl md:text-2xl tracking-[0.15em] text-yellow-500 uppercase group-hover:text-yellow-400 transition-colors hidden md:block leading-none">
                    Unity Group
                </span>
                <span className="hidden md:block text-[10px] text-slate-400 tracking-[0.3em] uppercase mt-1 ml-0.5">
                    Mitra Bisnis Anda
                </span>
            </div>

            {/* Mobile Text */}
            <span className="font-serif font-bold text-xl tracking-widest text-yellow-500 uppercase group-hover:text-yellow-400 transition-colors md:hidden">
                Unity Group
            </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors tracking-widest uppercase text-xs"
            >
              {link.label}
            </a>
          ))}
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          
          <Button 
            variant="outline" 
            className="py-2 px-6 text-xs font-bold tracking-wider uppercase border-white/20 text-white hover:bg-white/10"
            onClick={() => onNavigate('login')}
            icon={<UserCircle size={18} />}
          >
            Member Area
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white hover:text-yellow-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-slate-950 border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-fade-in-down">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-slate-300 hover:text-yellow-400 font-medium py-3 border-b border-white/5 uppercase tracking-widest text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4">
              <Button 
                variant="primary" 
                className="w-full justify-center"
                onClick={() => {
                    onNavigate('login');
                    setIsMobileMenuOpen(false);
                }}
              >
                Masuk / Daftar
              </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
