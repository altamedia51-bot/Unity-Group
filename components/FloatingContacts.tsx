
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export const FloatingContacts: React.FC = () => {
  const { content } = useContent();
  
  if (!content.socialMedia?.whatsapp) return null;

  // Format link WA
  const waLink = `https://wa.me/${content.socialMedia.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <a 
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-bounce hover:animate-none"
      aria-label="Chat WhatsApp"
      title="Hubungi Kami via WhatsApp"
    >
      <MessageCircle size={32} fill="white" className="text-[#25D366]" />
      
      {/* Tooltip Label */}
      <span className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
        Chat WhatsApp
        {/* Triangle pointer */}
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white"></div>
      </span>
    </a>
  );
};
