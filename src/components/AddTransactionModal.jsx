// src/components/AddTransactionModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, ChevronDown, Camera, Loader2, Image as ImageIcon, PlusCircle } from 'lucide-react';
import { MAIN_CATEGORIES, SUB_CATEGORIES, CURRENCIES } from '../utils/constants';
import CustomSelect from './CustomSelect.jsx';
import Tesseract from 'tesseract.js';

function AddTransactionModal({ isOpen, onClose, onSave, initialData, wallets = [], isDarkMode }) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    type: 'Expense',
    mainCategory: 'Variable Expenses',
    subCategory: '',
    customMainCategory: '',
    customSubCategory: '',
    walletId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isScanning, setIsScanning] = useState(false);
  const [showCustomCurrencyInput, setShowCustomCurrencyInput] = useState(false);
  const fileInputRef = useRef(null);

  // Filter main categories based on type
  const extendedMainCategories = React.useMemo(() => {
    const filtered = formData.type === 'Income'
      ? MAIN_CATEGORIES.filter(c => c.name === 'Income')
      : MAIN_CATEGORIES.filter(c => c.name !== 'Income');
    return [...filtered.map(c => c.name), "Other / Custom"];
  }, [formData.type]);

  const getExtendedSubCategories = (main) => {
    const subs = SUB_CATEGORIES[main] || [];
    return [...subs, "Other / Custom"];
  };

  useEffect(() => {
    if (initialData) {
      const isCustomMain = !MAIN_CATEGORIES.some(c => c.name === initialData.main_category);
      const isCustomSub = !SUB_CATEGORIES[initialData.main_category]?.includes(initialData.category);
      const isCustomCurr = !CURRENCIES.includes(initialData.currency);

      setFormData({
        ...initialData,
        mainCategory: isCustomMain ? "Other / Custom" : initialData.main_category,
        subCategory: isCustomSub ? "Other / Custom" : initialData.category,
        customMainCategory: isCustomMain ? initialData.main_category : '',
        customSubCategory: isCustomSub ? initialData.category : '',
        type: initialData.type || 'Expense',
        date: initialData.transaction_date || new Date().toISOString().split('T')[0],
        walletId: initialData.wallet_id || (wallets[0]?.id || '')
      });
      setShowCustomCurrencyInput(isCustomCurr);
    } else if (isOpen) {
      setFormData(prev => ({ 
        ...prev, 
        subCategory: SUB_CATEGORIES['Variable Expenses']?.[0] || '',
        walletId: wallets[0]?.id || '',
        currency: 'USD'
      }));
      setShowCustomCurrencyInput(false);
    }
  }, [initialData, isOpen, wallets]);

  const handleScanReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const amountMatch = text.match(/(\d+\.\d{2})/);
      if (amountMatch) setFormData(prev => ({ ...prev, amount: amountMatch[0] }));
    } catch (err) {
      console.error("OCR Error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalMain = formData.mainCategory === "Other / Custom" ? formData.customMainCategory : formData.mainCategory;
    const finalSub = formData.subCategory === "Other / Custom" ? formData.customSubCategory : formData.subCategory;
    
    onSave({
      ...formData,
      category: finalSub || 'General',
      main_category: finalMain || 'Other',
      wallet_id: formData.walletId
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-visible animate-slide-up border relative ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className={`px-10 py-8 border-b flex justify-between items-center ${
          isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
        }`}>
          <div>
            <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Transaction</h2>
            <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-1">Manual Entry & AI Scan</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand/20 transition-all hover:scale-[1.02]"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {isScanning ? 'Reading...' : 'Scan Receipt'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleScanReceipt} accept="image/*" className="hidden" />
            <button onClick={onClose} className={`p-3 rounded-2xl transition-all ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-200 hover:bg-slate-300'
            }`}>
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="flex p-1.5 rounded-2xl border mb-6 transition-all bg-white/5 border-white/10 max-w-xs">
            {['Expense', 'Income'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const defaultMain = type === 'Income' ? 'Income' : 'Variable Expenses';
                  setFormData({ 
                    ...formData, 
                    type,
                    mainCategory: defaultMain,
                    subCategory: SUB_CATEGORIES[defaultMain]?.[0] || ''
                  });
                }}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  formData.type === type 
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
             <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  {formData.type === 'Income' ? 'Credited to' : 'Paid via'}
                </label>
                <CustomSelect 
                  value={formData.walletId === 'cash' ? 'Cash' : (wallets.find(w => w.id === formData.walletId)?.name || 'Select Method')}
                  onChange={(val) => {
                    if (val === 'Cash') {
                      setFormData({ ...formData, walletId: 'cash' });
                    } else {
                      const wallet = wallets.find(w => w.name === val);
                      if (wallet) setFormData({ ...formData, walletId: wallet.id });
                    }
                  }}
                  options={['Cash', ...wallets.map(w => w.name)]}
                />
             </div>
             <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Currency</label>
                {showCustomCurrencyInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={3}
                      required
                      placeholder="e.g. INR"
                      className={`w-full border rounded-2xl p-3 text-xs font-black uppercase outline-none transition-all ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10 focus:border-[#7c3aed]/40 text-white' 
                          : 'bg-white border-slate-200 focus:border-[#7c3aed]/40 text-slate-900 shadow-sm'
                      }`}
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomCurrencyInput(false);
                        setFormData({ ...formData, currency: 'USD' });
                      }}
                      className={`px-3 rounded-2xl border text-[9px] font-black uppercase tracking-widest ${
                        isDarkMode ? 'border-white/10 text-slate-400 bg-white/5 hover:bg-white/10' : 'border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <CustomSelect 
                    value={formData.currency}
                    onChange={(val) => {
                      if (val === 'Custom...') {
                        setShowCustomCurrencyInput(true);
                        setFormData({ ...formData, currency: '' });
                      } else {
                        setFormData({ ...formData, currency: val });
                      }
                    }}
                    options={[...CURRENCIES, 'Custom...']}
                  />
                )}
             </div>
             <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Amount</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  className={`w-full border rounded-2xl p-3.5 text-lg font-black outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                      : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                  }`}
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Description</label>
              <input
                type="text"
                required
                className={`w-full border rounded-2xl p-3.5 text-xs font-bold outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                    : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                }`}
                placeholder={formData.type === 'Income' ? 'Where did this income come from?' : 'Where did you spend?'}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Date</label>
              <input
                type="date"
                required
                className={`w-full border rounded-2xl p-3.5 text-xs font-bold outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-brand/40 text-white' 
                    : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 shadow-sm'
                }`}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Category</label>
              <CustomSelect 
                value={formData.mainCategory}
                onChange={(val) => setFormData({ ...formData, mainCategory: val, subCategory: SUB_CATEGORIES[val]?.[0] || 'Other / Custom' })}
                options={extendedMainCategories}
              />
              {formData.mainCategory === "Other / Custom" && (
                <div className="animate-slide-down">
                  <input
                    type="text"
                    required
                    placeholder="Enter main category..."
                    className="w-full bg-brand/5 border border-brand/20 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-brand outline-none"
                    value={formData.customMainCategory}
                    onChange={(e) => setFormData({ ...formData, customMainCategory: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Sub-Category</label>
              <CustomSelect 
                value={formData.subCategory}
                onChange={(val) => setFormData({ ...formData, subCategory: val })}
                options={getExtendedSubCategories(formData.mainCategory)}
              />
              {formData.subCategory === "Other / Custom" && (
                <div className="animate-slide-down">
                  <input
                    type="text"
                    required
                    placeholder="Enter sub-category..."
                    className="w-full bg-brand/5 border border-brand/20 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-brand outline-none"
                    value={formData.customSubCategory}
                    onChange={(e) => setFormData({ ...formData, customSubCategory: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-8 py-5 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all ${
                isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand hover:bg-brand-deep text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/20 transition-all flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" />
              Complete Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;