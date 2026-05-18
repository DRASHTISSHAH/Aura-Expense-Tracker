// src/components/InvestmentsModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
import CustomSelect from './CustomSelect.jsx';

const ASSET_TYPES = ['Stocks', 'Crypto', 'Real Estate', 'Gold', 'Mutual Funds', 'Bonds', 'Other'];
const COLORS = ['#6366f1', '#78A1E2', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

function InvestmentsModal({ isOpen, onClose, onSave, initialData, isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    asset_type: 'Stocks',
    invested_amount: '',
    current_value: '',
    color: '#6366f1'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', asset_type: 'Stocks', invested_amount: '', current_value: '', color: '#6366f1' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-visible animate-slide-up border ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className={`px-8 py-6 border-b flex justify-between items-center ${
          isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
        }`}>
          <div>
            <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {initialData ? 'Edit Asset' : 'Add Investment'}
            </h2>
            <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-0.5">Portfolio Management</p>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-xl transition-all ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-200 hover:bg-slate-300'
          }`}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Asset Name</label>
              <input
                type="text"
                required
                className={`w-full border rounded-2xl p-3.5 text-xs font-bold outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                    : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                }`}
                placeholder="e.g. Apple Inc. (AAPL)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Asset Type</label>
              <CustomSelect 
                value={formData.asset_type}
                onChange={(val) => setFormData({ ...formData, asset_type: val })}
                options={ASSET_TYPES}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Invested Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    className={`w-full border rounded-2xl p-3.5 pl-10 text-xs font-bold outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                        : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                    }`}
                    placeholder="0.00"
                    value={formData.invested_amount}
                    onChange={(e) => setFormData({ ...formData, invested_amount: e.target.value })}
                  />
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Value</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    className={`w-full border rounded-2xl p-3.5 pl-10 text-xs font-bold outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                        : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                    }`}
                    placeholder="0.00"
                    value={formData.current_value}
                    onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                  />
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Display Color</label>
              <div className="flex gap-3 pt-1">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-brand scale-110 shadow-lg shadow-brand/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-4 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${
                isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand hover:bg-brand-deep text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvestmentsModal;
