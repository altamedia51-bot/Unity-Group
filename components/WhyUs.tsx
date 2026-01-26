import React from 'react';
import { FEATURES } from '../constants';
import { CheckCircle2 } from 'lucide-react';

const WhyUs: React.FC = () => {
  return (
    <section id="why-us" className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Mengapa Memilih <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-600">
                Unity Group?
              </span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Kami bukan sekadar vendor, melainkan mitra strategis yang peduli pada pertumbuhan jangka panjang bisnis Anda.
            </p>

            <div className="space-y-6">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">{feature.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 translate-y-8">
                     <img 
                        src="https://picsum.photos/400/500?random=1" 
                        alt="Office Luxury" 
                        className="w-full h-64 object-cover rounded-3xl opacity-80 hover:opacity-100 transition-opacity border border-white/10"
                    />
                     <img 
                        src="https://picsum.photos/400/400?random=2" 
                        alt="Discussion" 
                        className="w-full h-48 object-cover rounded-3xl opacity-80 hover:opacity-100 transition-opacity border border-white/10"
                    />
                </div>
                <div className="space-y-4">
                    <img 
                        src="https://picsum.photos/400/400?random=3" 
                        alt="Modern Building" 
                        className="w-full h-48 object-cover rounded-3xl opacity-80 hover:opacity-100 transition-opacity border border-white/10"
                    />
                     <img 
                        src="https://picsum.photos/400/500?random=4" 
                        alt="Success" 
                        className="w-full h-64 object-cover rounded-3xl opacity-80 hover:opacity-100 transition-opacity border border-white/10"
                    />
                </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20 pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyUs;