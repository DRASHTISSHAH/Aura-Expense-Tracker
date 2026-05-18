// src/components/SettingsPage.jsx
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Download, 
  Trash2
} from 'lucide-react';
import { CURRENCIES } from '../utils/constants';
import CustomSelect from './CustomSelect.jsx';
import { fetchTransactions } from '../services/api';

const SettingsSection = ({ title, description, children, zIndex = "z-10" }) => (
  <div className={`bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-visible shadow-xl dark:shadow-2xl animate-fade-in relative ${zIndex}`}>
    <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{description}</p>
    </div>
    <div className="p-10 space-y-8 overflow-visible">
      {children}
    </div>
  </div>
);

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between group overflow-visible">
    <div className="flex items-center gap-6">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-brand transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4 overflow-visible">
      {children}
    </div>
  </div>
);

const SettingsPage = ({ 
  user, 
  isDarkMode, 
  toggleDarkMode, 
  displayCurrency, 
  setDisplayCurrency,
  onShowConfirm
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [showCustomCurrency, setShowCustomCurrency] = useState(!CURRENCIES.includes(displayCurrency) && displayCurrency !== 'Other / Custom');

  const extendedCurrencies = [...CURRENCIES, "Other / Custom"];

  const handleCurrencyChange = (val) => {
    if (val === "Other / Custom") {
      setShowCustomCurrency(true);
      setDisplayCurrency("USD"); // Default until they type
    } else {
      setShowCustomCurrency(false);
      setDisplayCurrency(val);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await fetchTransactions('all');
      if (!data || data.length === 0) {
        alert("No transactions found to export.");
        return;
      }

      const headers = ['Date', 'Description', 'Category', 'Main Category', 'Amount', 'Currency'];
      const csvRows = [
        headers.join(','),
        ...data.map(t => [
          t.transaction_date,
          `"${(t.description || '').replace(/"/g, '""')}"`,
          t.category,
          t.main_category,
          t.amount,
          t.currency
        ].join(','))
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-40">
      <div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Settings</h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Account Preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-visible">
        <SettingsSection title="Profile" description="Personal identity & status">
          <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-white/5">
            <div className="w-20 h-20 bg-brand/10 dark:bg-brand/20 rounded-[2rem] flex items-center justify-center border-2 border-brand/10 dark:border-brand/20 shadow-lg shadow-brand/5">
              <User className="w-10 h-10 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{user?.email}</p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Preferences" description="Visual & regional settings" zIndex="z-50">
          <SettingRow 
            icon={Globe} 
            title="Display Currency" 
            description="Default currency for reports"
          >
            <div className="flex flex-col items-end gap-2">
              <CustomSelect 
                value={showCustomCurrency ? "Other / Custom" : displayCurrency} 
                onChange={handleCurrencyChange} 
                options={extendedCurrencies}
                className="w-32"
              />
              {showCustomCurrency && (
                <input
                  type="text"
                  maxLength="3"
                  placeholder="e.g. JPY"
                  className="w-24 bg-brand/5 border border-brand/20 rounded-xl p-2 text-[10px] font-black uppercase tracking-widest text-brand outline-none animate-slide-down"
                  value={displayCurrency === "Other / Custom" ? "" : displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value.toUpperCase())}
                />
              )}
            </div>
          </SettingRow>

          <SettingRow 
            icon={isDarkMode ? Moon : Sun} 
            title="Interface Theme" 
            description="Toggle between light and dark"
          >
            <button 
              onClick={toggleDarkMode}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-sm"
            >
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Data" description="Maintenance & exports">
          <SettingRow 
            icon={Download} 
            title="Export Data" 
            description="Download all records as CSV"
          >
            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-brand hover:text-white rounded-xl transition-all text-slate-500 dark:text-slate-400"
            >
               <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            </button>
          </SettingRow>
          <SettingRow 
            icon={Trash2} 
            title="Clear Cache" 
            description="Reset local application state"
          >
            <button 
              onClick={() => { 
                onShowConfirm(
                  "Clear Cache", 
                  "This will reset all your local preferences (Theme, Currency). Are you sure?", 
                  () => { localStorage.clear(); window.location.reload(); },
                  "Reset"
                );
              }}
              className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl transition-all text-slate-500 dark:text-slate-400"
            >
               <Trash2 className="w-4 h-4" />
            </button>
          </SettingRow>
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsPage;
