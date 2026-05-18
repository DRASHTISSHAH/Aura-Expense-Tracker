// src/components/CustomCurrencyModal.jsx
import React, { useState, useEffect } from 'react';
import { Globe, X, AlertCircle, Loader2 } from 'lucide-react';
import { fetchExchangeRates } from '../services/currencyService';

const CustomCurrencyModal = ({ isOpen, onClose, onSubmit, isDarkMode, currentRates = null }) => {
  const [currencyCode, setCurrencyCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Clear states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrencyCode('');
      setError('');
      setIsValidating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const upper = currencyCode.trim().toUpperCase();

    // 1. Client-side length and format check
    if (!/^[A-Z]{3}$/.test(upper)) {
      setError("Invalid code! Please enter exactly 3 letters (e.g., EUR, ALL).");
      return;
    }

    setIsValidating(true);
    try {
      // 2. Fetch fresh exchange rates if not cached
      let rates = currentRates;
      if (!rates) {
        rates = await fetchExchangeRates();
      }

      // 3. Validate against API rates map
      if (rates && rates[upper] !== undefined) {
        onSubmit(upper, rates);
        onClose();
      } else {
        setError(`Currency code "${upper}" is not supported by ExchangeRate-API.`);
      }
    } catch (err) {
      setError("Network error validating currency rates. Please try again.");
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border transition-all ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-8">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Add Custom Currency</span>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition-all border ${
              isDarkMode ? 'border-white/5 hover:bg-white/5 text-slate-400' : 'border-slate-100 hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="w-20 h-20 bg-brand/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-brand/10">
            <Globe className="w-10 h-10 text-brand" />
          </div>

          <h3 className={`text-2xl font-black text-center tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Enter Currency Code
          </h3>
          <p className="text-xs font-medium text-slate-500 text-center leading-relaxed px-4 mb-6">
            Input a 3-letter currency abbreviation. We'll verify it against global exchange rates dynamically.
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={3}
                placeholder="USD, EUR, ALL, INR..."
                value={currencyCode}
                onChange={(e) => {
                  setCurrencyCode(e.target.value);
                  setError('');
                }}
                disabled={isValidating}
                className={`w-full px-6 py-4 rounded-xl text-center text-lg font-black uppercase tracking-widest outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/5 focus:border-brand/40 text-white placeholder-slate-700' 
                    : 'bg-slate-50 border-slate-200 focus:border-brand/40 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Premium Inline Error Alert */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-wider animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </form>

        {/* Actions footer */}
        <div className={`p-6 border-t flex gap-3 ${
          isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
        }`}>
          <button
            type="button"
            onClick={onClose}
            disabled={isValidating}
            className={`flex-1 px-6 py-4 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${
              isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isValidating || !currencyCode.trim()}
            className="flex-1 bg-brand hover:bg-brand-deep text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Select'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomCurrencyModal;
