// src/components/dashboard/WalletStack.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Cpu, Eye, EyeOff } from 'lucide-react';
import { getCurrencySymbol } from '../../utils/currencyHelper';

const WalletCard = ({ wallet, onEdit, onDelete, canEdit, isDarkMode }) => {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const balance = parseFloat(wallet.balance || 0);
  const isCard = wallet.type?.toLowerCase() === 'debit' || wallet.type?.toLowerCase() === 'credit';

  return (
    <div
      className="flex-shrink-0 w-80 h-52 rounded-[2.5rem] relative overflow-hidden group shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
      style={{
        background: `linear-gradient(135deg, ${wallet.color} 0%, ${wallet.color}dd 100%)`,
        boxShadow: `0 20px 40px -10px ${wallet.color}40`
      }}
    >
      {/* Dynamic Keyframes Injection for Holographic Chip Shimmer */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes holoShimmer {
          0% { background-position: 0% 50%; filter: brightness(1) contrast(1.1); }
          50% { background-position: 100% 50%; filter: brightness(1.2) contrast(1.3); }
          100% { background-position: 0% 50%; filter: brightness(1) contrast(1.1); }
        }
      `}} />

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      <div className="relative h-full p-8 flex flex-col justify-between">
        {/* Top Row: Eye Icon & Chip */}
        <div className="flex justify-between items-start">
          <button
            onClick={() => setBalanceVisible(v => !v)}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/10 transition-all"
          >
            {balanceVisible
              ? <Eye className="w-4 h-4 text-white opacity-80" />
              : <EyeOff className="w-4 h-4 text-white opacity-80" />
            }
          </button>

          {/* Premium Metallic Holographic EMV Chip */}
          <div 
            className="w-10 h-8 rounded-lg relative overflow-hidden flex items-center justify-center shadow-lg border border-white/35"
            style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #c084fc 25%, #6366f1 50%, #22d3ee 75%, #fef08a 100%)',
              backgroundSize: '200% 200%',
              animation: 'holoShimmer 4s ease infiniteAlternate'
            }}
          >
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent 50%, #000 50%), linear-gradient(0deg, transparent 50%, #000 50%)',
                backgroundSize: '4px 4px'
              }}
            />
            <Cpu className="w-6 h-6 text-white/50 relative z-10" />
          </div>
        </div>

        {/* Middle: Card Number / Account Type Badge */}
        <div className="drop-shadow-lg">
          {isCard ? (
            <p className="text-xl font-black tracking-[0.25em] text-white opacity-90">
              •••• •••• •••• {wallet.cardNumber ? wallet.cardNumber.slice(-4) : '4242'}
            </p>
          ) : (
            <div className="flex items-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/15 text-white px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                {wallet.type || 'Asset'} Account
              </span>
            </div>
          )}
        </div>

        {/* Bottom Row: Name, Balance & Edit Buttons */}
        <div className="flex justify-between items-end">
          <div className="text-white">
            <p className="text-[8px] font-black opacity-50 uppercase tracking-[0.2em] mb-1">
              {wallet.name || 'BANK NAME'}
            </p>
            <p className="text-2xl font-black flex items-baseline gap-2 tracking-tight">
              {balanceVisible
                ? <>{getCurrencySymbol(wallet.currency)}{balance % 1 === 0 ? balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                : <span className="tracking-[0.15em] text-white/70">••••••</span>
              }
              <span className="text-[10px] opacity-40 font-black uppercase tracking-widest">
                {wallet.currency || 'USD'}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => onEdit(wallet)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md border border-white/20 transition-all text-white shadow-xl"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => onDelete(wallet.id)}
                className="p-3 bg-rose-500/20 hover:bg-rose-500 rounded-2xl backdrop-blur-md border border-white/10 transition-all text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mastercard Circles — ONLY for card types */}
      {isCard && (
        <div className="absolute bottom-16 right-8 flex items-center opacity-40 pointer-events-none">
          <div className="w-8 h-8 bg-rose-500 rounded-full" />
          <div className="w-8 h-8 bg-amber-500 rounded-full -ml-4" />
        </div>
      )}
    </div>
  );
};

const WalletStack = ({ wallets, onAdd, onEdit, onDelete, canEdit, isDarkMode }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center group/title">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Wallet</p>
          <p className={`text-xl font-black tracking-tight mt-1 group-hover/title:translate-x-1 transition-transform ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            My Assets
          </p>
        </div>
        <button
          onClick={onAdd}
          className="p-3 bg-brand hover:bg-brand-deep text-white rounded-2xl shadow-lg shadow-brand/20 transition-all active:scale-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-6 -mx-2 px-2 gap-6 custom-scrollbar">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
            isDarkMode={isDarkMode}
          />
        ))}

        {wallets.length === 0 && (
          <button
            onClick={onAdd}
            className={`flex-shrink-0 w-80 h-52 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 group transition-all ${
              isDarkMode ? 'border-white/10 hover:border-brand/40 bg-white/5' : 'border-slate-200 hover:border-brand/40 bg-slate-50'
            }`}
          >
            <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-500 group-hover:text-brand transition-all">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add New Wallet</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletStack;
