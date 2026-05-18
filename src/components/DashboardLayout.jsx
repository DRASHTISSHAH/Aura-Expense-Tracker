// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  PieChart, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Search,
  Target,
  Plus,
  Camera,
  Globe,
  Info,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import CustomSelect from './ui/CustomSelect';
import { CURRENCIES } from '../utils/constants';

const DashboardLayout = ({ 
  children, 
  isDarkMode, 
  toggleDarkMode, 
  setIsModalOpen, 
  currentPage, 
  setCurrentPage, 
  user,
  onLogout,
  onAdd,
  onScan,
  displayCurrency,
  setDisplayCurrency,
  ratesLastUpdated,
  dynamicCurrencies = []
}) => {
  // Build currency options dynamically to support custom verified additions
  const currencyOptions = [
    { value: '', label: '— Original —' },
    ...CURRENCIES.map(c => ({ value: c, label: c })),
    ...dynamicCurrencies.map(c => ({ value: c, label: c })),
    { value: 'CUSTOM', label: '+ Other...' }
  ];
  // Sidebar starts open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  // Sync on resize: open on desktop, close on mobile
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close sidebar and navigate
  const handleNav = (name) => {
    setCurrentPage(name);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Wallets', icon: Wallet },
    { name: 'Expenses', icon: Receipt },
    { name: 'Income', icon: TrendingUp },
    { name: 'Savings', icon: Target },
    { name: 'Investments', icon: PieChart },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#02020a] text-slate-100' : 'bg-slate-50 text-slate-900'} font-inter transition-colors duration-300`}>

      {/* ── MOBILE BACKDROP ── */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col p-8 w-72
        border-r transition-transform duration-300 ease-in-out
        ${isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo + X close button — always visible */}
        <div className="flex items-center justify-between gap-3 mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Expense<span className="text-brand">.</span>
            </span>
          </div>

          {/* X — always visible (closes on mobile, collapses on desktop) */}
          <button
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
            className={`p-2 rounded-xl transition-all border ${
              isDarkMode
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400 hover:text-white'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-500'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.name)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                currentPage === item.name 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : `text-slate-500 ${isDarkMode ? 'hover:bg-slate-800/50 hover:text-slate-300' : 'hover:bg-slate-100 hover:text-slate-900'}`
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentPage === item.name ? 'text-white' : 'group-hover:text-brand transition-colors'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className={`mt-auto p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
              <UserAvatar email={user?.email} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-black truncate uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Premium Member</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleDarkMode}
              className={`flex-1 flex items-center justify-center p-3 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="ml-2 text-[8px] font-black uppercase tracking-widest">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button 
              onClick={onLogout}
              className={`p-3 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-rose-500 hover:text-white text-rose-500' 
                  : 'bg-white border-slate-200 hover:bg-rose-500 hover:text-white text-rose-500'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT — shifts right when sidebar is open on desktop ── */}
      <main className={`flex-1 min-w-0 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>

        {/* ── STICKY HEADER ── */}
        <header className={`
          sticky top-0 z-20 flex flex-wrap items-center gap-4 px-6 md:px-10 py-5
          border-b backdrop-blur-md transition-colors
          ${isDarkMode ? 'bg-[#02020a]/90 border-white/5' : 'bg-white/90 border-slate-200'}
        `}>

          {/* Hamburger — only visible when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Date */}
          <div className="flex-1 min-w-0">
            <h1 className={`text-xs sm:text-base md:text-lg font-black tracking-tighter truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="inline sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">
              Financial Intelligence Dashboard
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-wrap justify-end">

            {/* Search */}
            <div className="hidden md:flex relative group w-48 lg:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text"
                placeholder="Find records..."
                className={`w-full py-2.5 pl-11 pr-4 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/5 focus:border-brand/40 text-white placeholder-slate-600' 
                    : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Currency selector + Info tooltip */}
            <div className="flex items-center gap-1.5">
              <CustomSelect
                value={displayCurrency}
                onChange={setDisplayCurrency}
                options={currencyOptions}
                icon={Globe}
                placeholder="— Original —"
              />

              {/* ⓘ Disclaimer tooltip */}
              <div className="relative group/tip flex items-center">
                <button
                  type="button"
                  aria-label="Currency conversion info"
                  className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-brand/20 hover:border-brand/30 hover:text-brand'
                      : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-brand/10 hover:border-brand/30 hover:text-brand'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                {/* Tooltip */}
                <div className={`
                  absolute right-0 top-full mt-2 w-72 rounded-2xl border p-4 z-[200]
                  opacity-0 pointer-events-none scale-95 origin-top-right
                  group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto group-hover/tip:scale-100
                  transition-all duration-200 ease-out shadow-2xl
                  ${isDarkMode ? 'bg-[#0f172a] border-white/10 shadow-black/60' : 'bg-white border-slate-200 shadow-slate-200'}
                `}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                      <Info className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Live Rate Disclaimer
                    </p>
                  </div>
                  <p className={`text-[11px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Amounts are converted using live mid-market rates sourced from{' '}
                    <span className="text-brand font-bold">ExchangeRate-API</span>. Actual
                    figures may vary <span className="text-brand font-bold">~0.5%</span> due
                    to bank spreads, transaction fees, and real-time market fluctuations.
                  </p>
                  <div className={`my-3 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`} />
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                      Rates fetched
                    </span>
                    <span className={`text-[9px] font-bold ${ratesLastUpdated ? 'text-brand' : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                      {ratesLastUpdated
                        ? new Date(ratesLastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                        : displayCurrency ? 'Loading…' : 'N/A — showing original'
                      }
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${displayCurrency ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                      {displayCurrency ? 'Live rates active' : 'Showing original currencies'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan */}
            <button 
              onClick={onScan}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Scan</span>
            </button>

            {/* Add */}
            <button 
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand shadow-lg shadow-brand/20 text-white hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Add</span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-brand/20 shadow-xl">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div className="p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

const UserAvatar = ({ email }) => (
  <div className="w-full h-full bg-gradient-to-br from-brand to-brand-deep flex items-center justify-center">
    <span className="text-white font-black text-lg uppercase">{email?.charAt(0) || 'U'}</span>
  </div>
);

export default DashboardLayout;