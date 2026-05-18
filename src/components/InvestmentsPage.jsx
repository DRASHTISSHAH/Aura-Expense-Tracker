// src/components/InvestmentsPage.jsx
import React from 'react';
import { PieChart, Plus, Edit3, Trash2, ArrowUpRight, ArrowDownLeft, Briefcase, TrendingUp } from 'lucide-react';

const InvestmentsPage = ({ investments, onAdd, onEdit, onDelete, isDarkMode }) => {
  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount || 0), 0);
  const currentTotal = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value || 0), 0);
  const totalGain = currentTotal - totalInvested;
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-6xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Portfolio</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 ml-1">Asset Allocation & Performance</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-deep text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Portfolio Summary Card */}
      <div className={`p-12 rounded-[3rem] border shadow-2xl relative overflow-hidden transition-all duration-500 ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
         <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <PieChart className="w-64 h-64 text-brand" />
         </div>
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Total Portfolio Value</p>
               <h2 className={`text-6xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                 ${currentTotal.toLocaleString()}
               </h2>
               {investments.length > 0 && (
                 <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   totalGain >= 0 ? 'bg-brand/10 text-brand' : 'bg-rose-500/10 text-rose-500'
                 }`}>
                   {totalGain >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                   ${Math.abs(totalGain).toLocaleString()} ({gainPercent.toFixed(2)}%)
                 </div>
               )}
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-12">
               <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-slate-500">Total Invested</p>
                  <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${totalInvested.toLocaleString()}</p>
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-slate-500">Active Assets</p>
                  <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{investments.length}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {investments.map((inv) => {
          const gain = inv.current_value - inv.invested_amount;
          const p = inv.invested_amount > 0 ? (gain / inv.invested_amount) * 100 : 0;
          return (
            <div 
              key={inv.id}
              className={`p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 group overflow-hidden ${
                isDarkMode ? 'bg-[#0f172a] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`} style={{ color: inv.color }}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(inv)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(inv.id)} className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl text-rose-500/50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mb-8">
                <h3 className={`text-2xl font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{inv.name}</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{inv.asset_type}</span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 text-slate-500">Current Value</p>
                      <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${parseFloat(inv.current_value).toLocaleString()}</p>
                   </div>
                   <div className={`text-right px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                     gain >= 0 ? 'text-brand bg-brand/10' : 'text-rose-500 bg-rose-500/10'
                   }`}>
                      {gain >= 0 ? '+' : '-'}{Math.abs(p).toFixed(2)}%
                   </div>
                </div>

                <div className={`h-2 w-full rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                   <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${Math.min(Math.abs(p), 100)}%`, 
                      backgroundColor: gain >= 0 ? '#78A1E2' : '#f43f5e' 
                    }} 
                  />
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest pt-2">
                   <span>Invested: ${parseFloat(inv.invested_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {investments.length === 0 && (
          <div className="col-span-full py-40 text-center">
             <div className="w-24 h-24 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                <TrendingUp className="w-10 h-10 text-slate-600" />
             </div>
             <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">No Assets Tracked</h3>
             <button onClick={onAdd} className="mt-6 text-brand font-black uppercase tracking-widest text-[10px] hover:underline">Add your first investment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;
