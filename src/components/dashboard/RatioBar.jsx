// src/components/dashboard/RatioBar.jsx
import React from 'react';

const RatioBar = ({ title, percent, color }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <p className="text-sm font-black text-text-muted uppercase tracking-widest">{title}</p>
            <p className="text-lg font-black text-text-primary dark:text-white">{percent.toFixed(1)}%</p>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-1">
            <div 
                className={`h-2 rounded-full ${color} shadow-lg shadow-current/20 transition-all duration-1000 ease-out`} 
                style={{ width: `${Math.min(percent, 100)}%` }}
            ></div>
        </div>
    </div>
);

export default RatioBar;
