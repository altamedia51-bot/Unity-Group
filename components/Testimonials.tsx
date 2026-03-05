import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useContent } from '../contexts/ContentContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export const Testimonials: React.FC = () => {
  const { content } = useContent();
  const { testimonials } = content;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Apa Kata <span className="text-yellow-500">Mereka?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Kepercayaan klien adalah aset terbesar kami. Berikut adalah pengalaman mereka bekerja sama dengan Unity Group.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl h-full flex flex-col relative hover:border-yellow-500/30 transition-colors duration-300">
                <Quote className="absolute top-6 right-6 text-yellow-500/10 w-12 h-12" />
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-700"} 
                    />
                  ))}
                </div>

                <p className="text-slate-300 mb-8 leading-relaxed flex-grow italic">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.name}</h4>
                    <p className="text-slate-500 text-xs">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
