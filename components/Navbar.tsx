import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { NAV_LINKS } from '../constants';

interface NavbarProps {
    onNavigate: (view: 'login' | 'register' | 'landing') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
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
        isScrolled || isMobileMenuOpen ? 'backdrop-blur-xl bg-slate-950/70 border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
        >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xl">U</div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 tracking-wide">
            UNITY GROUP
            </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <Button 
            variant="outline" 
            className="px-5 py-2 text-sm border-white/20 hover:border-yellow-400"
            onClick={() => onNavigate('login')}
          >
            Login / Daftar
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-fade-in-down">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-slate-300 hover:text-yellow-400 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('login');
            }}
          >
            Login Member
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;