// src/components/SavingsPage.jsx
import React, { useState } from 'react';
import { Target, Plus, Edit3, Trash2, Calendar, TrendingUp, Zap, ChevronRight } from 'lucide-react';

const SavingsPage = ({ targets, onAdd, onEdit, onDelete, isDarkMode }) => {
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-6xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Savings</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 ml-1">Track your financial milestones</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-deep text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {targets.map((target) => {
          const progress = Math.min((target.current_amount / target.target_amount) * 100, 100);
          return (
            <div 
              key={target.id}
              className={`p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden ${
                isDarkMode ? 'bg-[#0f172a] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 <Zap className="w-32 h-32 text-brand" />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`} style={{ color: target.color }}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(target)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(target.id)} className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl text-rose-500/50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="relative z-10 mb-8">
                <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{target.name}</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Target: {target.deadline ? new Date(target.deadline).toLocaleDateString() : 'No Deadline'}
                  </span>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Current</p>
                      <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${parseFloat(target.current_amount).toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Goal</p>
                      <p className={`text-sm font-black text-slate-500`}>${parseFloat(target.target_amount).toLocaleString()}</p>
                   </div>
                </div>

                <div className={`h-3 w-full rounded-full overflow-hidden p-0.5 border ${
                  isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div 
                    className="h-full rounded-full shadow-lg transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%`, backgroundColor: target.color, boxShadow: `0 0 20px ${target.color}40` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-brand uppercase tracking-widest">{progress.toFixed(1)}% Done</span>
                   <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Details <ChevronRight className="w-3 h-3" />
                   </div>
                </div>
              </div>
            </div>
          );
        })}

        {targets.length === 0 && (
          <div className="col-span-full py-40 text-center">
             <div className="w-24 h-24 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                <Target className="w-10 h-10 text-slate-600" />
             </div>
             <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">No Savings Targets Yet</h3>
             <button onClick={onAdd} className="mt-6 text-brand font-black uppercase tracking-widest text-[10px] hover:underline">Create your first goal</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsPage;
