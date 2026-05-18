// src/components/ui/CustomSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, icon: Icon, fullWidth = false, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalize options to objects with value and label
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') return { value: opt, label: opt };
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-slate-100 dark:bg-surface-dark px-4 py-3 rounded-xl border-2 border-transparent focus:border-brand/40 hover:border-brand/20 transition-all ${fullWidth ? 'w-full' : 'min-w-[120px]'}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span className="text-xs font-bold dark:text-white truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 ${fullWidth ? 'w-full' : 'w-48'} bg-white dark:bg-surface-alt border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-[60] overflow-hidden animate-fade-in py-1`}>
          <div className="max-h-60 overflow-y-auto premium-scrollbar">
            {normalizedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                  value === option.value 
                    ? 'bg-brand/10 text-brand' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
