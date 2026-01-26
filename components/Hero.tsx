import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './Button';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-950 z-0">
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
        {/* Subtle decorative gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm">
          <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
            🚀 Solusi Bisnis Terintegrasi No. 1
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
          Mitra Strategis <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 text-glow">
            Masa Depan Bisnis Anda
          </span>
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Unity Group menghadirkan solusi terintegrasi: <span className="text-white font-medium">Legalitas, Properti, Travel, hingga Digital</span>. 
          Satu pintu untuk akselerasi pertumbuhan bisnis Anda.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button 
            variant="primary" 
            icon={<MessageCircle size={20} />}
            className="w-full md:w-auto text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            Konsultasi Gratis
          </Button>
          <Button 
            variant="outline"
            className="w-full md:w-auto text-lg hover:bg-white/5 border-white/20 text-white"
          >
            Pelajari Layanan
          </Button>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Klien Puas', value: '1000+' },
            { label: 'Layanan', value: '50+' },
            { label: 'Tahun Pengalaman', value: '8+' },
            { label: 'Partner', value: '100+' },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-slate-500 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;