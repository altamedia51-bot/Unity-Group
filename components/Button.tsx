import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-slate-950 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:brightness-110",
    outline: "bg-transparent border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};