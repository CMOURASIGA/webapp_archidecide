
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost', isLoading?: boolean }> = ({ 
  children, variant = 'primary', isLoading, className, ...props 
}) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50";
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-600"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, title?: string, className?: string }> = ({ children, title, className }) => (
  <div className={`bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
        <h3 className="font-semibold text-zinc-800">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => (
  <div className="flex flex-col space-y-1 w-full">
    {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
    <input 
      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
      {...props} 
    />
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className="flex flex-col space-y-1 w-full">
    {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
    <textarea 
      className={`w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all min-h-[100px] ${className}`}
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="flex flex-col space-y-1 w-full">
    {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
    <select 
      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <input 
      type="checkbox"
      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
      {...props} 
    />
    <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{label}</span>
  </label>
);
