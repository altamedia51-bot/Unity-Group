
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { useContent } from '../contexts/ContentContext';

const Hero: React.FC = () => {
  const { content } = useContent();

  // Fungsi untuk menangani klik tombol WhatsApp
  const handleConsultation = () => {
      // Membersihkan nomor telepon (mengambil angkanya saja)
      const phoneNumber = content.socialMedia?.whatsapp?.replace(/[^0-9]/g, '') || '';
      
      // Pesan otomatis saat chat dibuka
      const message = encodeURIComponent("Halo Unity Group, saya tertarik untuk Konsultasi Gratis mengenai layanan bisnis Anda.");
      
      // Membuka WhatsApp di tab baru
      const url = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(url, '_blank');
  };

  // Fungsi scroll ke bagian layanan
  const scrollToServices = () => {
      const element = document.getElementById('services');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    // Mengubah min-h-screen menjadi min-h-[600px] dan py-20 untuk mengurangi jarak kosong vertikal
    <section id="hero" className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-20 lg:py-24">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-950 z-0">
        
        {/* Dynamic Background Image from CMS */}
        {content.hero.bannerImage && (
            <div 
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `url(${content.hero.bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2)' // Efek artistik agar teks tetap terbaca
                }}
            ></div>
        )}

        {/* Gradient Overlays untuk memastikan teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 z-1"></div>

        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse z-2"></div>
        
        {/* Subtle decorative gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] z-2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] z-2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm">
          <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
            {content.hero.tagline}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
           {/* Menangani newlines jika ada di headline */}
          {content.hero.headline.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                  {line}
                  {i < content.hero.headline.split('\n').length - 1 && <br className="hidden md:block" />}
              </React.Fragment>
          ))}
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          {content.hero.description}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button 
            variant="primary" 
            icon={<MessageCircle size={20} />}
            className="w-full md:w-auto text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            onClick={handleConsultation}
          >
            Konsultasi Gratis
          </Button>
          <Button 
            variant="outline"
            className="w-full md:w-auto text-lg hover:bg-white/5 border-white/20 text-white"
            onClick={scrollToServices}
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
    