import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
    <input
      className={`bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-rose-500">{error}</span>}
  </div>
);

export const Label = ({ children }: { children?: React.ReactNode }) => (
  <label className="text-sm font-medium text-slate-300 block mb-1">{children}</label>
);