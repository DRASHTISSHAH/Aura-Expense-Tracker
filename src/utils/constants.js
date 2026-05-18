// src/utils/constants.js

export const CURRENCIES = ['USD', 'INR', 'CAD', 'EUR', 'GBP', 'AUD'];

export const MAIN_CATEGORIES = [
  { name: 'Income', icon: 'TrendingUp', color: 'text-brand' },
  { name: 'Fixed Expenses', icon: 'Lock', color: 'text-rose-500' },
  { name: 'Variable Expenses', icon: 'Activity', color: 'text-amber-500' },
  { name: 'Investments', icon: 'PieChart', color: 'text-indigo-500' },
];

export const SUB_CATEGORIES = {
  'Income': ['Salary', 'Freelance', 'Gifts', 'Interest', 'Dividend'],
  'Fixed Expenses': ['Rent', 'Mortgage', 'Insurance', 'Utilities', 'Subscription'],
  'Variable Expenses': ['Food', 'Shopping', 'Travel', 'Health', 'Entertainment'],
  'Investments': ['Stocks', 'Crypto', 'Real Estate', 'Gold', 'Mutual Funds'],
};

export const NAV_ITEMS = [
  { name: 'Dashboard', icon: 'LayoutDashboard' },
  { 
    name: 'Expenses', 
    icon: 'Receipt',
    subItems: [
      { name: 'Fixed', icon: 'Lock', category: 'Fixed Expenses' },
      { name: 'Variable', icon: 'Activity', category: 'Variable Expenses' }
    ]
  },
  { name: 'Income', icon: 'TrendingUp' },
  { name: 'Investments', icon: 'PieChart' },
  { name: 'Settings', icon: 'Settings' },
];

export const WALLETS = [
  { id: 'w1', name: 'Main Wallet', balance: 5000, type: 'Debit', color: '#10b981' },
  { id: 'w2', name: 'HDFC Credit', balance: 1500, type: 'Credit', color: '#3b82f6' },
  { id: 'w3', name: 'Savings Account', balance: 12000, type: 'Savings', color: '#8b5cf6' },
  { id: 'w4', name: 'Cash', balance: 450, type: 'Cash', color: '#f59e0b' },
];
