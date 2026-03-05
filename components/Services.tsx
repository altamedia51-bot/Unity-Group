
import React, { useState } from 'react';
import { ArrowUpRight, Scale, Plane, Building2, Utensils, Laptop, X, CheckCircle2, MessageCircle, MoreHorizontal, Briefcase, FileText } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { ServiceItem } from '../types';
import { Button } from './Button';
import { SERVICES } from '../constants'; // Import default untuk fallback jika data kosong

const Services: React.FC = () => {
  const { content } = useContent();
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  // Helper untuk mendapatkan icon
  const getIcon = (service: ServiceItem, size: number = 32) => {
      const className = `text-yellow-400`;
      const title = service.title.toLowerCase();
      
      // Deteksi berdasarkan Judul (Prioritas)
      if (title.includes('pendirian') || title.includes('badan usaha') || title.includes('pt') || title.includes('cv')) {
          return <Briefcase size={size} className={className} />;
      }
      if (title.includes('legal') || title.includes('izin') || title.includes('haki') || title.includes('sertifikat')) {
          return <Scale size={size} className={className} />;
      }
      if (title.includes('travel') || title.includes('haji') || title.includes('umroh') || title.includes('tour') || title.includes('wisata')) {
          return <Plane size={size} className={className} />;
      }
      if (title.includes('property') || title.includes('properti') || title.includes('konstruksi') || title.includes('bangunan') || title.includes('interior')) {
          return <Building2 size={size} className={className} />;
      }
      if (title.includes('food') || title.includes('beverage') || title.includes('kuliner') || title.includes('catering') || title.includes('makan')) {
          return <Utensils size={size} className={className} />;
      }
      if (title.includes('digital') || title.includes('website') || title.includes('seo') || title.includes('aplikasi') || title.includes('sosmed')) {
          return <Laptop size={size} className={className} />;
      }
      if (title.includes('lain')) {
          return <MoreHorizontal size={size} className={className} />;
      }

      // Fallback ke ID jika judul tidak cocok
      switch(service.id) {
          case 'legal': return <Scale size={size} className={className} />;
          case 'travel': return <Plane size={size} className={className} />;
          case 'property': return <Building2 size={size} className={className} />;
          case 'fnb': return <Utensils size={size} className={className} />;
          case 'digital': return <Laptop size={size} className={className} />;
          case 'others': return <MoreHorizontal size={size} className={className} />;
          default: return <Scale size={size} className={className} />;
      }
  };

  // Mendapatkan detail layanan (Prioritas: Data Admin > Default Constant)
  const getServiceDetails = (service: ServiceItem) => {
      if (service.details && service.details.length > 0) {
          return service.details;
      }
      // Fallback ke constants jika data di DB belum ada 'details'
      const defaultService = SERVICES.find(s => s.id === service.id);
      return defaultService?.details || ["Layanan Profesional", "Konsultasi Terpercaya"];
  };

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
          {content.services.map((service) => (
            <div 
              key={service.id}
              className="group glass-card p-8 rounded-3xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(251,191,36,0.1)] flex flex-col h-full"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center mb-6 group-hover:border-yellow-500/30 transition-colors">
                  {getIcon(service, 32)}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                <button 
                    onClick={() => setActiveService(service)}
                    className="flex items-center text-yellow-500 text-sm font-semibold opacity-80 hover:opacity-100 hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  Selengkapnya <ArrowUpRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL POPUP */}
      {activeService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setActiveService(null)}
              ></div>

              {/* Modal Content */}
              <div className="relative bg-[#0a0a0a] border border-yellow-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(234,179,8,0.15)]">
                  {/* Close Button */}
                  <button 
                    onClick={() => setActiveService(null)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                  >
                      <X size={24} />
                  </button>

                  {/* Header Image / Pattern */}
                  <div className="h-32 bg-gradient-to-r from-yellow-500/10 to-amber-600/10 relative overflow-hidden">
                      <div className="absolute top-1/2 left-8 -translate-y-1/2">
                           <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-yellow-500/30 flex items-center justify-center shadow-lg">
                                {getIcon(activeService, 40)}
                           </div>
                      </div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  </div>

                  <div className="p-8 pt-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{activeService.title}</h3>
                      <p className="text-slate-400 mb-8 leading-relaxed">
                          {activeService.description} Kami berkomitmen memberikan layanan terbaik dengan standar profesionalisme tinggi untuk mendukung kesuksesan tujuan Anda.
                      </p>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
                          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <CheckCircle2 size={18} className="text-yellow-500" />
                              Cakupan Layanan:
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {getServiceDetails(activeService).map((detail, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></span>
                                      {detail}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                          <Button className="flex-1 justify-center" onClick={() => {
                              window.open(`https://wa.me/${content.socialMedia?.whatsapp?.replace(/[^0-9]/g, '')}?text=Halo Unity Group, saya ingin konsultasi mengenai layanan ${activeService.title}`, '_blank');
                          }}>
                              <MessageCircle size={18} />
                              Konsultasi via WhatsApp
                          </Button>
                          <Button variant="outline" className="flex-1 justify-center" onClick={() => setActiveService(null)}>
                              Tutup
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </section>
  );
};

export default Services;
