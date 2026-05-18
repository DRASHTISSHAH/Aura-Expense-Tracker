// src/components/ConfirmModal.jsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-rose-500/10">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          
          <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed px-4">
            {message}
          </p>
        </div>

        <div className={`p-6 border-t flex gap-3 ${
          isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-4 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${
              isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 transition-all active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
