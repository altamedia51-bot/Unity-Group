import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 
          ${icon ? 'pl-11' : ''} 
          text-white placeholder:text-slate-600 outline-none 
          focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 
          focus:bg-slate-900/80 transition-all duration-300 ${className}`}
          {...props}
        />
        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-xl bg-yellow-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
      </div>
    </div>
  );
};