// src/components/AuraChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { getFinancialAdvice } from '../services/aiService';

const SUGGESTIONS = [
  '📊 Summarize my spending',
  '💡 Give me savings suggestions',
  '🛑 What is my biggest expense?',
  '📈 Help me budget better'
];

const AuraChatbot = ({ transactions, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am **Aura**, your AI Financial Advisor. 🌟\n\nI have analyzed your active transaction ledger and am ready to help you optimize your budget. Ask me to **summarize your spending**, **suggest saving strategies**, or **analyze specific habits**!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (!textToSend) setInput('');
    setErrorMsg(null);
    
    const userMsg = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map message history to standard format for API
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const reply = await getFinancialAdvice(apiMessages, transactions);
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('[AuraChatbot Error]:', err);
      if (err.message === 'RATE_LIMIT_EXCEEDED') {
        setErrorMsg('RATE_LIMIT_EXCEEDED');
      } else {
        setErrorMsg("Failed to connect to Aura. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[90] p-4 bg-brand hover:bg-brand-deep text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        style={{ boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)' }}
      >
        <div className="absolute inset-0 bg-brand rounded-full blur-md opacity-40 group-hover:scale-125 transition-transform" />
        <MessageSquare className="w-6 h-6 relative z-10 animate-pulse-slow" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0f172a]" />
      </button>

      {/* Slide-out Sidebar Panel */}
      {isOpen && (
        <div 
          className={`fixed bottom-24 right-8 w-[380px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-8rem)] z-[90] flex flex-col rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#0f172a]/95 border-white/10 text-white backdrop-blur-xl' 
              : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-xl'
          }`}
          style={{ animation: 'auraSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <style>{`
            @keyframes auraSlideIn {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-brand/10 text-brand relative overflow-hidden">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <div className="absolute inset-0 bg-brand/20 blur-md rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                  Aura <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand/20 text-brand">Financial AI</span>
                </h3>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Your personal wealth assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {!showSuggestions && (
                <button
                  type="button"
                  onClick={() => setShowSuggestions(true)}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors text-brand animate-pulse"
                  title="Show suggestions"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-300"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/5 dark:bg-black/10">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className={`p-4 rounded-[1.5rem] text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand text-white rounded-br-sm font-semibold shadow-lg shadow-brand/15'
                    : isDarkMode 
                      ? 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm shadow-md'
                      : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">
                    {/* Render basic bold formatting inside markdown */}
                    {m.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-brand-light dark:text-brand">{part}</strong> : part)}
                  </p>
                </div>
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1 px-1">
                  {m.role === 'user' ? 'You' : 'Aura'}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto">
                <div className={`p-4 rounded-[1.5rem] rounded-bl-sm text-xs flex items-center gap-2 ${
                  isDarkMode ? 'bg-white/5 border border-white/10 text-slate-400' : 'bg-slate-100 border border-slate-200 text-slate-500'
                }`}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
                  <span className="font-bold tracking-wide animate-pulse">Aura is analyzing...</span>
                </div>
              </div>
            )}

            {errorMsg && (
              errorMsg === 'RATE_LIMIT_EXCEEDED' ? (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 to-[#7c3aed]/10 border border-amber-500/30 text-center animate-fade-in space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-amber-500">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Rate Limit Exceeded</span>
                  </div>
                  <h4 className={`text-xs font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Upgrade to Pro Version
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold leading-normal">
                    Unlock unlimited conversations with Aura, high-speed vision scanning, and smart budget goals.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => alert("Welcome to the Premium Tier upgrade portal! (Demo payment processed successfully)")}
                    className="w-full bg-gradient-to-r from-amber-500 to-[#7c3aed] text-white font-black uppercase tracking-widest text-[8px] py-2.5 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Unlock Pro Unlimited
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                  <button onClick={() => handleSend()} className="ml-auto p-1 hover:bg-rose-500/20 rounded-md">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {!loading && showSuggestions && (
            <div className="px-6 py-3 border-t border-white/5 bg-slate-950/10 dark:bg-black/20">
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Quick Prompts</p>
                <button 
                  type="button" 
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center"
                  title="Hide Prompts"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 hover:border-brand/40 text-slate-300 hover:text-white' 
                        : 'bg-slate-50 border-slate-200 hover:border-brand/40 text-slate-600 hover:text-slate-800 shadow-sm'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className={`p-5 border-t flex gap-3 items-center ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
          >
            <input
              type="text"
              placeholder="Ask Aura anything..."
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold outline-none border transition-all ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10 focus:border-brand/40 text-white placeholder-slate-600' 
                  : 'bg-white border-slate-200 focus:border-brand/40 text-slate-900 placeholder-slate-400'
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-brand hover:bg-brand-deep text-white rounded-xl shadow-lg shadow-brand/10 disabled:opacity-50 transition-all flex items-center justify-center active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AuraChatbot;
