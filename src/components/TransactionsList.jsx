// src/components/TransactionsList.jsx
import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3,
  Calendar,
  Tag,
  CreditCard,
  Wallet,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

import { getCurrencySymbol } from '../utils/currencyHelper';

const TransactionsList = ({ 
  transactions, 
  onDelete, 
  onEdit, 
  searchQuery, 
  setSearchQuery,
  isDarkMode,
  title = 'Recent Activity'
}) => {
  // Sort State: defaults to sorting by transaction_date in descending order (newest first)
  const [sortConfig, setSortConfig] = React.useState({ key: 'transaction_date', direction: 'desc' });

  // Search filter logic: Case-insensitive substring match on description, category, and currency code
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      const search = (searchQuery || '').toLowerCase();
      return (
        (t.description || '').toLowerCase().includes(search) ||
        (t.category || '').toLowerCase().includes(search) ||
        (t.currency || '').toLowerCase().includes(search) ||
        String(t.amount || '').includes(search)
      );
    });
  }, [transactions, searchQuery]);

  // Sort logic: Handles sorting by transaction date, category, or signed amount with defensive NaN fallbacks
  const sortedTransactions = React.useMemo(() => {
    let sortableItems = [...filteredTransactions];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'amount') {
          // Sort by signed amount (expense is negative, income is positive)
          const aAmt = Number(a.amount || 0);
          const bAmt = Number(b.amount || 0);
          const aType = (a.type || '').toLowerCase();
          const bType = (b.type || '').toLowerCase();
          aValue = aAmt * (aType === 'expense' ? -1 : 1);
          bValue = bAmt * (bType === 'expense' ? -1 : 1);
        } else if (sortConfig.key === 'transaction_date') {
          aValue = new Date(a.transaction_date || 0).getTime();
          bValue = new Date(b.transaction_date || 0).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = (bValue || '').toLowerCase();
        }

        // Defensive checks for NaN comparison failures
        if (typeof aValue === 'number' && isNaN(aValue)) aValue = 0;
        if (typeof bValue === 'number' && isNaN(bValue)) bValue = 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransactions, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    console.log('[Antigravity Sort Debug] Sorting by:', key, 'direction:', direction);
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 opacity-30 pointer-events-none" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-3.5 h-3.5 text-brand pointer-events-none" />;
    }
    return <ChevronDown className="w-3.5 h-3.5 text-brand pointer-events-none" />;
  };

  const getSymbol = (code) => getCurrencySymbol(code);

  return (
    <div className={`rounded-[3rem] border shadow-2xl overflow-hidden transition-all duration-500 ${
      isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
    }`}>
      <div className="px-12 py-10 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30 dark:bg-white/5">
        <div>
          <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Transaction Stream</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-brand transition-colors" />
            <input 
              type="text"
              placeholder="Filter list..."
              className={`w-full py-3 pl-11 pr-4 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${
                isDarkMode 
                  ? 'bg-black/20 border-white/10 focus:border-brand/40 text-white placeholder-slate-600' 
                  : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 placeholder-slate-400'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={`p-3 rounded-xl border transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
          }`}>
             <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
              <th 
                className="px-12 py-6 text-[10px] font-black uppercase tracking-widest cursor-pointer select-none hover:text-brand transition-colors"
                onClick={() => handleSort('transaction_date')}
              >
                <div className="flex items-center gap-1.5 pointer-events-none">
                  Transaction
                  {renderSortIcon('transaction_date')}
                </div>
              </th>
              <th 
                className="px-6 py-6 text-[10px] font-black uppercase tracking-widest cursor-pointer select-none hover:text-brand transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1.5 pointer-events-none">
                  Category
                  {renderSortIcon('category')}
                </div>
              </th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center select-none">Method</th>
              <th 
                className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-right cursor-pointer select-none hover:text-brand transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1.5 pointer-events-none">
                  Amount
                  {renderSortIcon('amount')}
                </div>
              </th>
              <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-center select-none">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
            {sortedTransactions.map((t) => (
              <tr key={t.id} className={`group transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                <td className="px-12 py-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                      t.type?.toLowerCase() === 'expense'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                        : 'bg-brand/10 border-brand/20 text-brand'
                    }`}>
                      {t.type?.toLowerCase() === 'expense' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {(() => {
                              if (!t.transaction_date) return '';
                              const parts = t.transaction_date.split('-');
                              if (parts.length === 3) {
                                return `${parts[2]}/${parts[1]}/${parts[0]}`;
                              }
                              const d = new Date(t.transaction_date);
                              if (isNaN(d.getTime())) return t.transaction_date;
                              const day = String(d.getDate()).padStart(2, '0');
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                   <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                         <Tag className="w-3 h-3 text-slate-500" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.category}</span>
                   </div>
                </td>
                <td className="px-6 py-6 text-center">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {!t.wallet_id ? <Wallet className="w-3 h-3 text-brand" /> : <CreditCard className="w-3 h-3 text-blue-500" />}
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                         {!t.wallet_id ? 'Cash' : 'Card'}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className={`text-lg font-black tracking-tighter ${
                    t.type?.toLowerCase() === 'expense' ? 'text-rose-500' : 'text-brand'
                  }`}>
                    {t.type?.toLowerCase() === 'expense' ? '-' : '+'}{getSymbol(t.currency)}{Math.abs(t.amount) % 1 === 0 ? Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-12 py-6">
                  <div className="flex items-center justify-center gap-2 transition-all duration-300">
                    <button 
                      onClick={() => onEdit(t)}
                      className={`p-3 rounded-xl border transition-all active:scale-95 ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-700 shadow-lg shadow-black/20' 
                          : 'bg-white border-slate-200 text-slate-500 hover:text-brand hover:border-brand/30 shadow-sm'
                      }`}
                    >
                      <Edit3 className="w-4 h-4 pointer-events-none" />
                    </button>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className={`p-3 rounded-xl border transition-all active:scale-95 ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-700/80 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 shadow-lg shadow-black/20' 
                          : 'bg-white border-slate-200 text-rose-500/60 hover:text-rose-600 hover:border-rose-200 shadow-sm'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 pointer-events-none" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedTransactions.length === 0 && (
          <div className="px-12 py-32 text-center">
             <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Search className="w-8 h-8 text-slate-600" />
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;