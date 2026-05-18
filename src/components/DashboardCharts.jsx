// src/components/DashboardCharts.jsx
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';

// ─── Category → color map ────────────────────────────────────────────────────
// Known sub-categories get a specific color; unknown ones fall back to the
// rotating FALLBACK_PALETTE so every slice is always visually distinct.
const CATEGORY_COLORS = {
  // Income
  'Salary':         '#10b981', // emerald
  'Freelance':      '#3b82f6', // blue
  'Gifts':          '#f59e0b', // amber
  'Interest':       '#8b5cf6', // purple
  'Dividend':       '#ec4899', // pink

  // Fixed Expenses
  'Rent':           '#ef4444', // red
  'Mortgage':       '#06b6d4', // cyan
  'Insurance':      '#84cc16', // lime
  'Utilities':      '#f97316', // orange
  'Subscription':   '#a855f7', // fuchsia

  // Variable Expenses
  'Food':           '#fcd34d', // bright yellow/amber
  'Shopping':       '#ec4899', // pink
  'Travel':         '#3b82f6', // blue
  'Health':         '#10b981', // emerald
  'Entertainment':  '#8b5cf6', // violet

  // Investments
  'Stocks':         '#6366f1', // indigo
  'Crypto':         '#d946ef', // fuchsia 2
  'Real Estate':    '#14b8a6', // teal
  'Gold':           '#eab308', // gold/yellow
  'Mutual Funds':   '#8b5cf6', // purple

  // Catch-all
  'General':        '#94a3b8',
};

// Rotating palette for any category not in the map above
const FALLBACK_PALETTE = [
  '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#3b82f6',
  '#84cc16', '#a855f7', '#22d3ee', '#fb923c', '#e879f9',
];

const getCategoryColor = (name, index) =>
  CATEGORY_COLORS[name] ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, isDarkMode }) => {
  if (active && payload && payload.length) {
    const color = payload[0].payload?.fill ?? '#7c3aed';
    return (
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {payload[0].name}
          </p>
        </div>
        <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {parseFloat(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardCharts = ({ transactions, isDarkMode }) => {

  // Pie: category breakdown (expenses only for meaningful split)
  const categoryData = transactions
    .filter(t => t.type?.toLowerCase() === 'expense')
    .reduce((acc, t) => {
      const cat = t.category || 'General';
      const amount = Math.abs(parseFloat(t.amount || 0));
      const existing = acc.find(item => item.name === cat);
      if (existing) existing.value += amount;
      else acc.push({ name: cat, value: amount });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value)
    .map((item, i) => ({ ...item, fill: getCategoryColor(item.name, i) }));

  // Area: spending over time
  const sortedTx = [...transactions]
    .filter(t => t.type?.toLowerCase() === 'expense')
    .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
  const dailyData = sortedTx.reduce((acc, t) => {
    const date = new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const amount = Math.abs(parseFloat(t.amount || 0));
    const existing = acc.find(item => item.date === date);
    if (existing) existing.amount += amount;
    else acc.push({ date, amount });
    return acc;
  }, []);

  const isEmpty = categoryData.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ── Category Pie ── */}
      <div className={`lg:col-span-1 p-8 rounded-[3rem] border shadow-2xl flex flex-col ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Category Split
        </h3>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Expense breakdown</p>

        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No expense data</p>
          </div>
        ) : (
          <>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1 premium-scrollbar">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.fill }}
                    />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">
                      {cat.name}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black shrink-0 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {cat.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Spending Trend Area ── */}
      <div className={`lg:col-span-2 p-8 rounded-[3rem] border shadow-2xl ${
        isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Spending Pulse
        </h3>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Daily transaction total</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#ffffff08' : '#00000008'} vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#7c3aed"
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSpend)" 
                dot={false}
                activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
