import React from 'react';
import { SERVICES } from '../constants';
import { ArrowUpRight } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id="services" className="relative py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ekosistem <span className="text-yellow-500">Layanan</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Solusi komprehensif yang dirancang khusus untuk memenuhi setiap aspek kebutuhan bisnis dan gaya hidup Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div 
              key={service.id}
              className="group glass-card p-8 rounded-3xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(251,191,36,0.1)]"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center mb-6 group-hover:border-yellow-500/30 transition-colors">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex items-center text-yellow-500 text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Selengkapnya <ArrowUpRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;