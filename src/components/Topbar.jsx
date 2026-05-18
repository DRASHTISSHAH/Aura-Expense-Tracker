// src/components/Topbar.jsx
import React from 'react';
import { Search, Plus, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { CURRENCIES } from '../utils/constants';
import CustomSelect from './ui/CustomSelect';
import { signOut } from '../services/auth';

function Topbar({ setIsModalOpen, isDarkMode, toggleDarkMode, user, displayCurrency, setDisplayCurrency }) {
  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload(); // Refresh to trigger the auth state change in App.jsx
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="flex justify-between items-center h-20 px-8 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-blue-900/30 z-30 transition-colors">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 group-focus-within:text-brand transition-colors w-7 h-7 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-surface-alt/50 border border-transparent focus:border-brand/40 rounded-xl text-xs font-medium outline-none transition-all dark:text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        {/* PREMIUM CUSTOM DROPDOWN */}
        <CustomSelect 
          value={displayCurrency} 
          onChange={setDisplayCurrency} 
          options={CURRENCIES} 
          icon={Globe} 
        />

        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-blue-900/20 hover:bg-slate-200 dark:hover:bg-blue-900/30 transition-colors border border-slate-200 dark:border-blue-900/30"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 rounded-xl flex items-center gap-2 bg-brand text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand/10 hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-blue-900/30">
           <div className="text-right hidden xl:block">
              <p className="text-[11px] font-black text-slate-900 dark:text-white leading-none mb-0.5 uppercase tracking-tighter">
                {user?.user_metadata?.full_name || 'QA Tester'}
              </p>
              <div className="flex items-center justify-end gap-1">
                 <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></div>
                 <p className="text-[8px] font-bold text-brand uppercase tracking-widest">Live</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-brand/30 shadow-md shadow-brand/10">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=tester`} alt="User" />
             </div>
             <button 
               onClick={handleLogout}
               title="Sign Out"
               className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
             >
               <LogOut className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;