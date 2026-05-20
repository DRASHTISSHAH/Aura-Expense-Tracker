// src/App.jsx

import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "./components/DashboardLayout.jsx";
import AddTransactionModal from "./components/AddTransactionModal.jsx";
import WalletModal from "./components/WalletModal.jsx";
import SavingsModal from "./components/SavingsModal.jsx";
import InvestmentsModal from "./components/InvestmentsModal.jsx";
import OCRModal from "./components/OCRModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";
import CustomCurrencyModal from "./components/CustomCurrencyModal.jsx";
import DashboardMetrics from "./components/DashboardMetrics.jsx";
import TransactionsList from "./components/TransactionsList.jsx";
import WalletStack from "./components/dashboard/WalletStack.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import SavingsPage from "./components/SavingsPage.jsx";
import InvestmentsPage from "./components/InvestmentsPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import LandingPage from "./components/LandingPage.jsx";
import AuraChatbot from "./components/AuraChatbot.jsx";
import { supabase, signOut } from "./services/auth";
import { 
  fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
  fetchWallets, createWallet, updateWallet, deleteWallet as apiDeleteWallet,
  fetchSavings, createSavings, updateSavings, deleteSavings as apiDeleteSavings,
  fetchInvestments, createInvestment, updateInvestment, deleteInvestment as apiDeleteInvestment,
  fetchCombinedAppData
} from "./services/api";
import { fetchExchangeRates, convertCurrency, getLastUpdated } from "./services/currencyService";

function App() { 
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isInvestmentsModalOpen, setIsInvestmentsModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [dateRange, setDateRange] = useState('6m'); 
  const [dashboardKey, setDashboardKey] = useState(0);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [walletToEdit, setWalletToEdit] = useState(null);
  const [savingsToEdit, setSavingsToEdit] = useState(null);
  const [investmentToEdit, setInvestmentToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  // '' = show each transaction in its original currency (default)
  // Setting a code converts all amounts to that currency for the session
  const [displayCurrency, setDisplayCurrency] = useState('');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);
  const [dynamicCurrencies, setDynamicCurrencies] = useState([]);

  const [isCustomCurrencyModalOpen, setIsCustomCurrencyModalOpen] = useState(false);

  // Update display currency; fetch rates if a real currency is chosen
  const handleSetDisplayCurrency = useCallback((currency) => {
    if (currency === 'CUSTOM') {
      setIsCustomCurrencyModalOpen(true);
      return;
    }

    setDisplayCurrency(currency);
    if (!currency) {
      setExchangeRates(null);
      setRatesLastUpdated(null);
    }
  }, []);

  const handleCustomCurrencySubmit = useCallback((upper, rates) => {
    if (!dynamicCurrencies.includes(upper)) {
      setDynamicCurrencies(prev => [...prev, upper]);
    }
    setDisplayCurrency(upper);
    setExchangeRates(rates);
    setRatesLastUpdated(getLastUpdated());
  }, [dynamicCurrencies]);

  const [wallets, setWallets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Delete' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Loads wallets, savings, and investments only.
  // Transactions are handled exclusively by loadTransactions() to avoid double-fetching.
  const loadAppData = useCallback(async () => {
    if (!session) return;
    try {
      const data = await fetchCombinedAppData();
      setWallets(data.wallets.map(w => ({ ...w, cardNumber: w.card_number })));
      setSavings(data.savings);
      setInvestments(data.investments);
    } catch (error) { console.error("Failed to load app data:", error); }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadAppData();
    }
  }, [session, loadAppData]);

  // Fetch live USD-based exchange rates only when user picks a display currency
  useEffect(() => {
    if (!displayCurrency || displayCurrency === '') {
      setExchangeRates(null);
      setRatesLastUpdated(null);
      return;
    }
    fetchExchangeRates().then(rates => {
      if (rates) {
        setExchangeRates(rates);
        setRatesLastUpdated(getLastUpdated());
      }
    });
  }, [displayCurrency]);

  const handleOCRComplete = (data) => {
    setTransactionToEdit(data);
    setIsOCRModalOpen(false);
    setIsModalOpen(true);
  };

  const handleSaveWallet = async (data) => {
    try {
      if (data.id) await updateWallet(data.id, data);
      else await createWallet(data);
      setIsWalletModalOpen(false);
      setWalletToEdit(null);
      loadAppData();
    } catch (error) { console.error("Failed to save wallet:", error); }
  };

  const handleSaveSavings = async (data) => {
    try {
      if (data.id) await updateSavings(data.id, data);
      else await createSavings(data);
      setIsSavingsModalOpen(false);
      setSavingsToEdit(null);
      loadAppData();
    } catch (error) { console.error("Failed to save savings:", error); }
  };

  const handleSaveInvestment = async (data) => {
    try {
      if (data.id) await updateInvestment(data.id, data);
      else await createInvestment(data);
      setIsInvestmentsModalOpen(false);
      setInvestmentToEdit(null);
      loadAppData();
    } catch (error) { console.error("Failed to save investment:", error); }
  };

  const showConfirm = (title, message, onConfirm, confirmText = "Delete") => {
    setConfirmState({ isOpen: true, title, message, onConfirm, confirmText });
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const loadTransactions = useCallback(async (range) => {
    if (!session) return;
    try {
      const data = await fetchTransactions(range);
      setTransactions(data);
    } catch (error) { console.error("Failed to fetch transactions:", error); }
  }, [session]);

  // Reload transactions whenever dateRange changes
  useEffect(() => { loadTransactions(dateRange); }, [loadTransactions, dateRange]);

  const processedTransactions = React.useMemo(() => {
    const base = transactions.map(t => {
      let derivedType = t.type;
      if (!derivedType) {
        const catLower = t.category?.toLowerCase() || '';
        const mainLower = t.main_category?.toLowerCase() || '';
        const isIncome = mainLower.includes('income') || 
                         catLower.includes('income') ||
                         ['salary', 'freelance', 'gifts', 'interest', 'dividend'].includes(catLower);
        derivedType = isIncome ? 'Income' : 'Expense';
      }
      return {
        ...t,
        type: derivedType
      };
    }).sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    // No display currency chosen → show each transaction in its original entered currency
    if (!displayCurrency || !exchangeRates) return base;

    // User has chosen a target currency → convert all amounts
    return base.map(t => ({
      ...t,
      originalAmount: t.amount,
      originalCurrency: t.currency,
      amount: convertCurrency(t.amount, t.currency, displayCurrency, exchangeRates),
    }));
  }, [transactions, displayCurrency, exchangeRates]);

  const processedWallets = React.useMemo(() => {
    return wallets.map(w => {
      const walletTransactions = transactions.filter(t => t.wallet_id === w.id);
      const netAmount = walletTransactions.reduce((sum, t) => {
        const rawAmount = parseFloat(t.amount || 0);
        const amountInWalletCurrency = convertCurrency(rawAmount, t.currency || 'USD', w.currency || 'USD', exchangeRates);
        const isIncome = t.type === 'Income' || 
                         t.main_category?.toLowerCase().includes('income') || 
                         t.category?.toLowerCase().includes('income');
        return isIncome ? sum + amountInWalletCurrency : sum - amountInWalletCurrency;
      }, 0);
      return {
        ...w,
        balance: parseFloat(w.balance || 0) + netAmount
      };
    });
  }, [wallets, transactions, exchangeRates]);

  const handleSaveTransaction = useCallback(async (data) => {
    try {
      if (data.id) await updateTransaction(data.id, data);
      else await createTransaction(data);
      setIsModalOpen(false);
      setTransactionToEdit(null);
      loadTransactions(dateRange);
      setDashboardKey(prev => prev + 1);
    } catch (error) { console.error("Failed to save transaction:", error); }
  }, [loadTransactions, dateRange]); 

  const handleDeleteTransaction = useCallback(async (id) => {
    showConfirm(
      "Delete Transaction",
      "Are you sure you want to remove this record? This action cannot be undone.",
      async () => {
        try {
          await deleteTransaction(id);
          loadTransactions(dateRange);
          setDashboardKey(prev => prev + 1);
        } catch (error) { console.error("Failed to delete transaction:", error); }
      }
    );
  }, [loadTransactions, dateRange]);

  useEffect(() => {
    // Intentionally left blank to prevent scroll jump glitch
  }, [showLogin]);

  if (!session) {
    return (
      <div className="min-h-screen bg-black relative" style={{ overflow: showLogin ? 'hidden' : 'auto' }}>
        {/* Landing Layer - Always visible but inactive when login is up */}
        <div style={{ 
          opacity: 1, 
          pointerEvents: showLogin ? 'none' : 'auto',
          transition: 'all 1s ease',
          position: 'relative',
          zIndex: 1
        }}>
          <LandingPage onScrollDown={() => setShowLogin(true)} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} hideText={showLogin} />
        </div>
        
        {/* Login Portal Layer - Overlaying without hiding the 3D card */}
        {showLogin && (
          <div 
            style={{ 
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'transparent',
              animation: 'portalFadeIn 1s cubic-bezier(0.23, 1, 0.32, 1) forwards' 
            }}
            onWheel={(e) => { if (e.deltaY < -50) setShowLogin(false); }}
          >
            <style>{`
              @keyframes portalFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <LoginPage isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
          </div>
        )}
      </div>
    );
  }

  const renderContent = () => {
    if (currentPage === "Dashboard") {
      return (
        <div className="space-y-6">
          <DashboardMetrics 
            dashboardKey={dashboardKey}
            dateRange={dateRange} 
            setDateRange={setDateRange}
            displayCurrency={displayCurrency}
            transactions={processedTransactions}
            savings={savings}
            isDarkMode={isDarkMode}
            wallets={processedWallets}
            exchangeRates={exchangeRates}
          />
          <WalletStack 
            wallets={processedWallets} 
            onDelete={(id) => showConfirm("Remove Card", "Delete this card permanently?", () => apiDeleteWallet(id).then(loadAppData))} 
            onAdd={() => { setWalletToEdit(null); setIsWalletModalOpen(true); }} 
            onEdit={(w) => { setWalletToEdit(w); setIsWalletModalOpen(true); }}
            canEdit={false}
            isDarkMode={isDarkMode}
          />
          <TransactionsList
            transactions={processedTransactions.slice(0, 5)}
            onDelete={handleDeleteTransaction}
            onEdit={(t) => {
              setTransactionToEdit({ ...t, amount: t.originalAmount, currency: t.originalCurrency });
              setIsModalOpen(true);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (currentPage === "Wallets") {
      return <WalletStack wallets={processedWallets} onDelete={(id) => showConfirm("Remove Card", "Delete this card permanently?", () => apiDeleteWallet(id).then(loadAppData))} onAdd={() => { setWalletToEdit(null); setIsWalletModalOpen(true); }} onEdit={(w) => { setWalletToEdit(w); setIsWalletModalOpen(true); }} canEdit={true} isDarkMode={isDarkMode} />;
    }

    if (currentPage === "Expenses") {
      const expenses = processedTransactions.filter(t => t.type?.toLowerCase() === 'expense');
      return (
        <TransactionsList
          transactions={expenses}
          onDelete={handleDeleteTransaction}
          onEdit={(t) => {
            setTransactionToEdit({ ...t, amount: t.originalAmount, currency: t.originalCurrency });
            setIsModalOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkMode={isDarkMode}
          title="Expense Ledger"
        />
      );
    }

    if (currentPage === "Income") {
      const income = processedTransactions.filter(t => t.type?.toLowerCase() === 'income');
      return (
        <TransactionsList
          transactions={income}
          onDelete={handleDeleteTransaction}
          onEdit={(t) => {
            setTransactionToEdit({ ...t, amount: t.originalAmount, currency: t.originalCurrency });
            setIsModalOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkMode={isDarkMode}
          title="Income Streams"
        />
      );
    }

    if (currentPage === "Savings") {
      return <SavingsPage targets={savings} onAdd={() => { setSavingsToEdit(null); setIsSavingsModalOpen(true); }} onEdit={(s) => { setSavingsToEdit(s); setIsSavingsModalOpen(true); }} onDelete={(id) => showConfirm("Delete Goal", "Are you sure you want to delete this savings target?", () => apiDeleteSavings(id).then(loadAppData))} isDarkMode={isDarkMode} />;
    }

    if (currentPage === "Investments") {
      return <InvestmentsPage investments={investments} onAdd={() => { setInvestmentToEdit(null); setIsInvestmentsModalOpen(true); }} onEdit={(i) => { setInvestmentToEdit(i); setIsInvestmentsModalOpen(true); }} onDelete={(id) => showConfirm("Remove Asset", "Remove this asset from your portfolio tracking?", () => apiDeleteInvestment(id).then(loadAppData))} isDarkMode={isDarkMode} />;
    }

    if (currentPage === "Settings") {
      return (
        <SettingsPage 
          user={session.user} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          displayCurrency={displayCurrency} 
          setDisplayCurrency={setDisplayCurrency} 
          onShowConfirm={showConfirm}
        />
      );
    }

    return <div className="text-white p-20 text-center uppercase tracking-widest font-black opacity-20">Coming Soon</div>;
  };

  return (
    <>
      <DashboardLayout 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        setIsModalOpen={setIsModalOpen} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={session.user} 
        displayCurrency={displayCurrency} 
        setDisplayCurrency={handleSetDisplayCurrency} 
        ratesLastUpdated={ratesLastUpdated}
        dynamicCurrencies={dynamicCurrencies}
        onLogout={() => showConfirm("Sign Out", "Are you sure you want to end your session?", handleLogout, "Logout")}
        onAdd={() => { setTransactionToEdit(null); setIsModalOpen(true); }}
        onScan={() => setIsOCRModalOpen(true)}
      >
        {renderContent()}
      </DashboardLayout>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setTransactionToEdit(null); }} onSave={handleSaveTransaction} initialData={transactionToEdit} wallets={processedWallets} isDarkMode={isDarkMode} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => { setIsWalletModalOpen(false); setWalletToEdit(null); }} onSave={handleSaveWallet} initialData={walletToEdit} isDarkMode={isDarkMode} />
      <SavingsModal isOpen={isSavingsModalOpen} onClose={() => { setIsSavingsModalOpen(false); setSavingsToEdit(null); }} onSave={handleSaveSavings} initialData={savingsToEdit} isDarkMode={isDarkMode} />
      <InvestmentsModal isOpen={isInvestmentsModalOpen} onClose={() => { setIsInvestmentsModalOpen(false); setInvestmentToEdit(null); }} onSave={handleSaveInvestment} initialData={investmentToEdit} isDarkMode={isDarkMode} />
      <OCRModal isOpen={isOCRModalOpen} onClose={() => setIsOCRModalOpen(false)} isDarkMode={isDarkMode} onScanComplete={handleOCRComplete} />
      <AuraChatbot transactions={processedTransactions} isDarkMode={isDarkMode} />
      
      <CustomCurrencyModal 
        isOpen={isCustomCurrencyModalOpen} 
        onClose={() => setIsCustomCurrencyModalOpen(false)} 
        onSubmit={handleCustomCurrencySubmit} 
        isDarkMode={isDarkMode} 
        currentRates={exchangeRates} 
      />

      <ConfirmModal 
        isOpen={confirmState.isOpen} 
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })} 
        onConfirm={confirmState.onConfirm} 
        title={confirmState.title} 
        message={confirmState.message} 
        confirmText={confirmState.confirmText}
        isDarkMode={isDarkMode} 
      />
    </>
  );
}

export default App;