// src/components/DashboardMetrics.jsx
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Target, 
  Zap
} from 'lucide-react';
import DashboardCharts from './DashboardCharts.jsx';
import { getCurrencySymbol } from '../utils/currencyHelper';
import { convertCurrency } from '../services/currencyService';

const MetricCard = ({ title, amount, change, icon: Icon, color, isDarkMode, symbol = '$' }) => {
  const parsedAmount = parseFloat(amount || 0);
  const isWhole = parsedAmount % 1 === 0;
  const formatted = isWhole 
    ? parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 ${
      isDarkMode 
        ? 'bg-[#0f172a]/40 border-white/5 shadow-2xl' 
        : 'bg-white border-slate-200 shadow-xl'
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed]`}>
          <Icon className="w-6 h-6" />
        </div>
        {/* Only show % badge when there is real data */}
        {amount > 0 && change !== null && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            change >= 0 ? 'bg-[#7c3aed]/10 text-[#7c3aed]' : 'bg-rose-500/10 text-rose-500'
          }`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
        <h3 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {symbol}{formatted}
        </h3>
      </div>
    </div>
  );
};

const DashboardMetrics = ({ 
  dateRange, 
  setDateRange, 
  displayCurrency, 
  transactions = [], 
  savings = [], 
  isDarkMode, 
  wallets = [], 
  exchangeRates = null 
}) => {
  // Determine dynamic base currency and symbol
  const baseCurrency = displayCurrency || wallets[0]?.currency || 'USD';
  const baseSymbol = getCurrencySymbol(baseCurrency);

  // 1. Total Balance: Sum of all wallet balances converted to baseCurrency
  const totalBalance = wallets.reduce((acc, w) => {
    const originalBalance = parseFloat(w.balance || 0);
    const converted = convertCurrency(originalBalance, w.currency || 'USD', baseCurrency, exchangeRates);
    return acc + converted;
  }, 0);

  // 2. Monthly Income: Sum of all incomes converted to baseCurrency
  const totalIncome = transactions
    .filter(t => t.type?.toLowerCase() === 'income')
    .reduce((acc, t) => {
      // If displayCurrency is active, t.amount is already converted in App.jsx.
      // If displayCurrency is empty, we convert original transaction amount to baseCurrency.
      const amount = Math.abs(parseFloat(t.amount || 0));
      const currency = t.currency || 'USD';
      const converted = displayCurrency 
        ? amount 
        : convertCurrency(amount, currency, baseCurrency, exchangeRates);
      return acc + converted;
    }, 0);

  // 3. Total Expenses: Sum of all expenses converted to baseCurrency
  const totalExpense = transactions
    .filter(t => t.type?.toLowerCase() === 'expense')
    .reduce((acc, t) => {
      const amount = Math.abs(parseFloat(t.amount || 0));
      const currency = t.currency || 'USD';
      const converted = displayCurrency 
        ? amount 
        : convertCurrency(amount, currency, baseCurrency, exchangeRates);
      return acc + converted;
    }, 0);

  const activeSaving = savings.length > 0 ? savings[0] : null;
  const progress = activeSaving ? Math.min((activeSaving.current_amount / activeSaving.target_amount) * 100, 100) : 0;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
           <h1 className={`text-5xl sm:text-6xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Overview</h1>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 ml-1">Real-time Financial Intel</p>
        </div>
        
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div className={`flex p-1.5 rounded-2xl border w-full sm:w-auto justify-between sm:justify-start ${isDarkMode ? 'bg-[#0f172a]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            {['1m', '6m', '1y', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  dateRange === range 
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Total Balance" 
          amount={totalBalance} 
          change={null} 
          icon={Wallet} 
          color="brand"
          isDarkMode={isDarkMode}
          symbol={baseSymbol}
        />
        <MetricCard 
          title="Total Income" 
          amount={totalIncome} 
          change={null} 
          icon={TrendingUp} 
          color="brand"
          isDarkMode={isDarkMode}
          symbol={baseSymbol}
        />
        <MetricCard 
          title="Total Expenses" 
          amount={totalExpense} 
          change={null} 
          icon={TrendingDown} 
          color="rose-500"
          isDarkMode={isDarkMode}
          symbol={baseSymbol}
        />
        <MetricCard 
          title="Net Savings" 
          amount={totalIncome - totalExpense} 
          change={null} 
          icon={totalIncome - totalExpense >= 0 ? TrendingUp : TrendingDown} 
          color={totalIncome - totalExpense >= 0 ? "brand" : "rose-500"}
          isDarkMode={isDarkMode}
          symbol={baseSymbol}
        />
      </div>

      <DashboardCharts transactions={transactions} isDarkMode={isDarkMode} />

      {activeSaving && (
      <div className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden transition-all duration-500 ${
        isDarkMode ? 'bg-[#0f172a]/40 border-white/5' : 'bg-white border-slate-200'
      }`}>
         <div className="absolute top-0 right-0 p-12 opacity-5">
            <Zap className="w-64 h-64 text-brand" />
         </div>
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="col-span-1">
               <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                 {activeSaving.name}
               </h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                 Current Goal
               </p>
               
               <div className="mt-8 flex items-baseline gap-2">
                  <span className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {baseSymbol}{parseFloat(activeSaving.current_amount).toLocaleString()}
                  </span>
                  <span className="text-slate-500 font-bold">
                    / {baseSymbol}{parseFloat(activeSaving.target_amount).toLocaleString()}
                  </span>
               </div>
            </div>

            <div className="col-span-2">
               <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest">{progress.toFixed(1)}% Achieved</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {activeSaving?.deadline ? `Est. ${Math.ceil((new Date(activeSaving.deadline) - new Date()) / (1000 * 60 * 60 * 24))} Days Left` : 'Ongoing'}
                  </span>
               </div>
               <div className={`h-4 w-full rounded-full overflow-hidden p-1 border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  <div 
                    className="h-full bg-brand rounded-full shadow-lg shadow-brand/40 animate-grow-width transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                  />
               </div>
               
               <div className="grid grid-cols-3 gap-8 mt-10">
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                     <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                       {progress >= 100 ? 'Goal Reached!' : 'In Progress'}
                     </p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Remaining</p>
                     <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                       {baseSymbol}{(activeSaving.target_amount - activeSaving.current_amount).toLocaleString()}
                     </p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Priority</p>
                     <p className={`text-sm font-black text-brand`}>High</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
      )}
    </div>
  );
};

export default DashboardMetrics;