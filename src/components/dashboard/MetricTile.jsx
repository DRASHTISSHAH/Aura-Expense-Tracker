// src/components/dashboard/MetricTile.jsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

const MetricTile = ({ title, value, icon, colorClass }) => {
  const Icon = LucideIcons[icon] || LucideIcons.CircleHelp;
  
  return (
    <div className="glass-card p-6 flex items-start justify-between group hover:translate-y-[-4px] transition-all duration-300 bg-white dark:bg-surface-alt">
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{title}</p>
        <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
          {value}
        </p>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} shadow-md shadow-current/10 group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default MetricTile;
