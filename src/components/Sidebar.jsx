// src/components/Sidebar.jsx
import { useState } from 'react';
import { NAV_ITEMS } from '../utils/constants';
import * as Icons from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function Sidebar({ currentPage, setCurrentPage }) {
  const [openMenus, setOpenMenus] = useState(['Expenses']); // Keep Expenses open by default

  const toggleMenu = (name) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <aside className="w-80 h-screen bg-surface-dark border-r border-blue-900/30 flex flex-col z-20">
      <div className="p-10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/30">
            <Icons.Zap className="w-6 h-6 fill-current" style={{ color: '#0d1220' }} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">ExpenseTracker</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isSelected = currentPage === item.name;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openMenus.includes(item.name);

          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.name);
                  } else {
                    setCurrentPage(item.name);
                  }
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isSelected ? 'bg-brand text-surface-dark shadow-lg shadow-brand/25' : 'text-slate-400 hover:bg-blue-900/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {renderIcon(item.icon)}
                  <span className="text-sm font-black tracking-wide uppercase">{item.name}</span>
                </div>
                {hasSubItems && (
                  isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {hasSubItems && isOpen && (
                <div className="ml-12 space-y-1 py-1 animate-slide-up">
                  {item.subItems.map((sub) => {
                    const isSubSelected = currentPage === sub.category;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => setCurrentPage(sub.category)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                          isSubSelected ? 'text-brand font-black' : 'text-blue-400/40 hover:text-blue-300'
                        }`}
                      >
                        {renderIcon(sub.icon)}
                        <span className="text-xs font-black uppercase tracking-widest">{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-8">
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(120,161,226,0.06)', border: '1px solid rgba(120,161,226,0.12)' }}>
          <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Cloud Synced</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
            <span className="text-xs font-bold" style={{ color: 'rgba(142,178,235,0.45)' }}>Secure Node</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;