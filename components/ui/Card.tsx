import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
  </div>
);