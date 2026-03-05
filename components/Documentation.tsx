import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { Camera, Handshake, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export const Documentation: React.FC = () => {
  const { content } = useContent();
  const { documentation } = content;

  return (
    <section id="documentation" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-semibold uppercase tracking-wider mb-4">
             <Camera size={14} /> Galeri Aktivitas
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {documentation.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {documentation.subtitle}
          </p>
        </div>

        {/* Custom Navigation Buttons */}
        <div className="relative group">
            <div className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-12 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300 backdrop-blur-sm">
                <ChevronLeft size={20} />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-12 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300 backdrop-blur-sm">
                <ChevronRight size={20} />
            </div>

            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{ 
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={{
                    prevEl: '.swiper-button-prev-custom',
                    nextEl: '.swiper-button-next-custom',
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                        effect: 'slide', // Fallback to slide on mobile for better UX
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                        effect: 'slide',
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                        effect: 'coverflow', // Enable coverflow on desktop
                    },
                }}
                className="w-full py-10"
            >
            {documentation.items.map((item, index) => (
                <SwiperSlide key={index} className="max-w-[350px] md:max-w-[400px]">
                    <div 
                        className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[4/5] cursor-pointer border border-white/10 hover:border-yellow-500/50 transition-all duration-500 bg-slate-900/50 shadow-2xl"
                    >
                        {/* Image */}
                        <img 
                            src={item.imageUrl} 
                            alt={item.caption} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 transition-opacity duration-300"></div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                {item.category === 'handover' ? (
                                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg shadow-blue-900/20">
                                        Penyerahan
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-500 text-black text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-900/20">
                                        <Handshake size={12} /> Kemitraan
                                    </span>
                                )}
                            </div>
                            <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                {item.caption}
                            </h3>
                            <div className="w-12 h-1 bg-yellow-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 w-0 group-hover:w-12"></div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>

        {/* Call to Action Button (Optional) */}
        <div className="mt-12 text-center">
             <p className="text-slate-500 text-sm">Ingin menjadi mitra kami atau konsultasi legalitas?</p>
             <a href="#footer" className="inline-block mt-2 text-yellow-400 hover:text-yellow-300 font-semibold border-b border-yellow-400/50 hover:border-yellow-300 transition-colors">
                 Hubungi Kami &rarr;
             </a>
        </div>
      </div>
      
      <style>{`
        .swiper-pagination-bullet {
            background-color: #475569;
            opacity: 1;
        }
        .swiper-pagination-bullet-active {
            background-color: #EAB308;
            width: 24px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
};