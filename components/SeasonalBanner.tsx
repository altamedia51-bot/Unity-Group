import React, { useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const SeasonalBanner: React.FC = () => {
  const { content } = useContent();
  const { seasonal } = content;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide logic
  useEffect(() => {
    if (!seasonal.isEnabled || seasonal.images.length <= 1) return;

    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % seasonal.images.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(interval);
  }, [seasonal.isEnabled, seasonal.images.length]);

  const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % seasonal.images.length);
  };

  const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + seasonal.images.length) % seasonal.images.length);
  };

  if (!seasonal.isEnabled || seasonal.images.length === 0) return null;

  return (
    // UPDATE: Menggunakan pt-20 (80px) pas dengan tinggi navbar, dan menghapus margin-top berlebih.
    // Ditambah mt-4 untuk memberi sedikit jarak estetik (16px) antara navbar dan banner.
    <section className="relative pt-20 pb-0 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 mt-4 mb-2">
        
        {/* Header Kecil (Opsional) */}
        {seasonal.title && (
            <div className="text-center mb-2 animate-fade-in-down">
                <span className="text-yellow-500 text-[10px] font-bold tracking-widest uppercase border-b border-yellow-500/30 pb-0.5">
                    {seasonal.title}
                </span>
            </div>
        )}

        {/* Carousel Container */}
        <div className="relative rounded-3xl overflow-hidden border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.1)] group">
            
            {/* Slides - Aspect Ratio disesuaikan */}
            <div className="relative w-full aspect-[21/9] md:aspect-[21/6] bg-slate-900">
                {seasonal.images.map((img, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                         <img 
                            src={img} 
                            alt={`Banner ${index + 1}`} 
                            className="w-full h-full object-cover block"
                        />
                         {/* Shine Effect */}
                         <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${index === currentSlide ? 'animate-[shimmer_2s_infinite]' : ''}`}></div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (Hanya muncul jika gambar > 1) */}
            {seasonal.images.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300"
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* Dots Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {seasonal.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-4 bg-yellow-500' : 'bg-white/50 hover:bg-white'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
      </div>
    </section>
  );
};