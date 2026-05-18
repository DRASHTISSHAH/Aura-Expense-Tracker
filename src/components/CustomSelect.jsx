// src/components/CustomSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is truly outside the container
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 250);
    }

    // Use 'mousedown' for faster response and to prevent event bubbling issues
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop the event from bubbling up to parents (like modals)
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
      >
        <span className="truncate pr-2">{value}</span>
        <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 right-0 w-full border rounded-2xl shadow-2xl z-[100] py-3 animate-fade-in backdrop-blur-xl ${
          openUpward ? 'bottom-full mb-2' : 'mt-2'
        } ${
          document.documentElement.classList.contains('dark') 
            ? 'bg-[#0f172a] border-white/10' 
            : 'bg-white border-slate-200 shadow-slate-200'
        }`}>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  value === opt 
                    ? 'text-brand bg-brand/5' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
