// src/components/WalletModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, CreditCard, Eye, EyeOff } from 'lucide-react';
import { CURRENCIES } from '../utils/constants';
import CustomSelect from './CustomSelect.jsx';

const COLORS = [
  '#1a1a24', // Obsidian Carbon
  '#0d5245', // Luxury Emerald
  '#1e40af', // Cobalt Metallic
  '#c29b68', // Champagne Gold
  '#7f1d1d', // Imperial Ruby
  '#581c87', // Deep Amethyst
  '#475569', // Nordic Platinum
  '#0f766e'  // Futuristic Teal
];
const TYPES = ['Debit', 'Credit', 'Cash', 'Savings', 'Investment'];

function WalletModal({ isOpen, onClose, onSave, initialData, isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Debit',
    balance: '',
    cardNumber: '',
    color: '#1a1a24',
    currency: 'USD',
    customCurrency: ''
  });
  const [showBalance, setShowBalance] = useState(false);

  const extendedCurrencies = [...CURRENCIES, "Other / Custom"];

  useEffect(() => {
    if (initialData) {
      const isCustomCurrency = !CURRENCIES.includes(initialData.currency);
      setFormData({
        ...initialData,
        currency: isCustomCurrency ? "Other / Custom" : (initialData.currency || 'USD'),
        customCurrency: isCustomCurrency ? initialData.currency : ''
      });
    } else {
      setFormData({ 
        name: '', 
        type: 'Debit', 
        balance: '', 
        cardNumber: '', 
        color: '#1a1a24', 
        currency: 'USD',
        customCurrency: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCurrency = formData.currency === "Other / Custom" ? formData.customCurrency : formData.currency;
    const isCard = formData.type === 'Debit' || formData.type === 'Credit';
    onSave({
      ...formData,
      cardNumber: isCard ? formData.cardNumber : '',
      currency: finalCurrency || 'USD'
    });
  };

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
              {initialData ? 'Edit Asset / Card' : 'Add New Asset / Card'}
            </h2>
            <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-0.5">Digital Wallet Management</p>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-xl transition-all ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-200 hover:bg-slate-300'
          }`}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Card / Account Name */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card / Account Name</label>
              <input
                type="text"
                required
                className={`w-full border rounded-2xl p-3.5 text-xs font-bold outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                    : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                }`}
                placeholder="e.g. HDFC Credit Card"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Currency + Balance row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3 relative">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Currency</label>
                <CustomSelect 
                  value={formData.currency}
                  onChange={(val) => setFormData({ ...formData, currency: val })}
                  options={extendedCurrencies}
                />
                {formData.currency === "Other / Custom" && (
                  <input
                    type="text"
                    required
                    maxLength="3"
                    placeholder="e.g. JPY"
                    className="w-full bg-brand/5 border border-brand/20 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-brand outline-none animate-slide-down mt-2"
                    value={formData.customCurrency}
                    onChange={(e) => setFormData({ ...formData, customCurrency: e.target.value.toUpperCase() })}
                  />
                )}
              </div>

              {/* Balance with show/hide toggle */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Balance</label>
                <div className="relative">
                  <input
                    type={showBalance ? 'number' : 'password'}
                    required
                    step="0.01"
                    className={`w-full border rounded-2xl p-3.5 pr-11 text-xs font-bold outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                        : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                    }`}
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBalance(!showBalance)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition-colors"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Card Type */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card Type</label>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                      formData.type === t 
                        ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' 
                        : isDarkMode ? 'bg-white/5 border-white/5 text-slate-500 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Last 4 Digits — required ONLY for Debit / Credit Cards */}
            {(formData.type === 'Debit' || formData.type === 'Credit') && (
              <div className="animate-fade-in duration-300">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Last 4 Digits of Card <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={4}
                    minLength={4}
                    pattern="\d{4}"
                    inputMode="numeric"
                    className={`w-full border rounded-2xl p-3.5 pl-11 text-sm font-black outline-none tracking-[0.5em] transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                        : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                    }`}
                    placeholder="4242"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setFormData({ ...formData, cardNumber: val });
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[9px] font-bold text-slate-400 tracking-wide">
                  Only the last 4 digits are stored for display purposes.
                </p>
              </div>
            )}

            {/* Card Theme */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card Theme</label>
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
              Save Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WalletModal;
