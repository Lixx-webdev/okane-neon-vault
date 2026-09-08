import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { soundFx } from '../utils/soundEffects';
import { DEFAULT_CATEGORIES } from '../utils/storage';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  PlusCircle, 
  Wallet, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard({ data, onOpenAddTx, setActiveTab }) {
  const [oracleActive, setOracleActive] = useState(true);

  // Compute key totals
  const totalIncome = data.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = data.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;

  // Compute expense per category
  const categoryTotals = DEFAULT_CATEGORIES.map(cat => {
    const total = data.transactions
      .filter(t => t.type === 'expense' && t.category === cat.id)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const budget = data.categoryBudgets[cat.id] || 0;

    return {
      name: cat.name,
      id: cat.id,
      color: cat.color,
      amount: total,
      budget: budget
    };
  }).filter(c => c.amount > 0 || c.budget > 0);

  // Top spending category
  const topSpendingCategory = [...categoryTotals].sort((a, b) => b.amount - a.amount)[0] || { name: 'None', amount: 0 };

  // Dynamic AI Cyber Oracle Insights
  const getOracleAdvice = () => {
    if (savingsRate >= 50) {
      return {
        title: "EXCELLENT VAULT EFFICIENCY",
        msg: `Your Cyber Savings Rate is a stellar ${savingsRate}%! You are exceeding monthly financial targets. Consider depositing your extra surplus into long-term savings goals or investments.`,
        status: "OPTIMAL",
        color: "text-cyan-300"
      };
    } else if (savingsRate >= 20) {
      return {
        title: "BALANCED CASHFLOW",
        msg: `Solid ${savingsRate}% savings rate. Highest outflow detected in "${topSpendingCategory.name}" ($${topSpendingCategory.amount}). Keep an eye on non-essential impulse buys!`,
        status: "STABLE",
        color: "text-purple-200"
      };
    } else {
      return {
        title: "WARNING: VAULT DEPLETION RISK",
        msg: `Savings rate is currently ${savingsRate}%. Total expenses ($${totalExpenses}) are nearing monthly income ($${totalIncome}). Try completing a Finance Quiz to earn XP and unlock budget hacks!`,
        status: "CRITICAL",
        color: "text-pink-300 font-bold"
      };
    }
  };

  const advice = getOracleAdvice();

  // Pie chart formatted data
  const pieData = categoryTotals
    .filter(c => c.amount > 0)
    .map(c => ({ name: c.name, value: c.amount, color: c.color }));

  // Budget vs Actual formatted data
  const budgetVsActualData = categoryTotals.map(c => ({
    category: c.name.split(' ')[0],
    Spent: c.amount,
    Budget: c.budget,
    color: c.color
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-vapor p-5 rounded-2xl border border-pink-500/40 shadow-xl">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-200">
            FINANCIAL COMMAND TERMINAL
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal leading-relaxed">
            Real-time monthly expense tracking, cashflow metrics & cybernetic advice.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenAddTx();
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-bold font-orbitron text-xs md:text-sm shadow-lg shadow-pink-500/40 hover:brightness-110 active:scale-95 transition-all border border-pink-300/40 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>LOG TRANSACTION</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Net Balance */}
        <div className="glass-vapor p-5 rounded-xl border border-cyan-500/40 relative overflow-hidden group hover:border-cyan-300 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-cyan-200 font-orbitron font-semibold mb-1">
            <span>NET VAULT BALANCE</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-orbitron text-white my-1 tracking-tight">
            ${netBalance.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300 font-medium">
            {netBalance >= 0 ? (
              <span className="flex items-center text-emerald-400 font-semibold">
                <ArrowUpRight className="w-4 h-4" /> Positive Surplus
              </span>
            ) : (
              <span className="flex items-center text-pink-400 font-semibold">
                <ArrowDownRight className="w-4 h-4" /> Deficit Alert
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Total Income */}
        <div className="glass-vapor p-5 rounded-xl border border-emerald-500/40 relative overflow-hidden group hover:border-emerald-300 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-orbitron font-semibold mb-1">
            <span>TOTAL INCOME</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-orbitron text-emerald-300 my-1 tracking-tight">
            +${totalIncome.toLocaleString()}
          </div>
          <div className="text-xs text-slate-300 font-medium">
            Target: ${data.monthlyIncomeTarget.toLocaleString()} / mo
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="glass-vapor p-5 rounded-xl border border-pink-500/40 relative overflow-hidden group hover:border-pink-300 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-pink-300 font-orbitron font-semibold mb-1">
            <span>MONTHLY EXPENSES</span>
            <TrendingDown className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-orbitron text-pink-300 my-1 tracking-tight">
            -${totalExpenses.toLocaleString()}
          </div>
          <div className="text-xs text-slate-300 font-medium truncate">
            Top: {topSpendingCategory.name} (${topSpendingCategory.amount})
          </div>
        </div>

        {/* Card 4: Savings Rate */}
        <div className="glass-vapor p-5 rounded-xl border border-yellow-500/40 relative overflow-hidden group hover:border-yellow-300 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-yellow-300 font-orbitron font-semibold mb-1">
            <span>SAVINGS RATE</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-orbitron text-yellow-200 my-1 tracking-tight">
            {savingsRate}%
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-2 border border-yellow-500/30">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-pink-500" 
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* A.U.R.O.R.A. AI Oracle Insights Module */}
      <div className="glass-vapor p-5 rounded-xl border border-purple-500/50 relative bg-gradient-to-r from-purple-950/70 via-[#160a2d]/90 to-indigo-950/70 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300">
                A.U.R.O.R.A. FINANCIAL ORACLE
              </h3>
              <span className="text-xs text-cyan-300/80 font-mono font-semibold">
                SYSTEM STATUS: {advice.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => setOracleActive(!oracleActive)}
            className="text-xs text-cyan-300 hover:text-white font-orbitron cursor-pointer"
          >
            {oracleActive ? 'COLLAPSE' : 'EXPAND'}
          </button>
        </div>

        {oracleActive && (
          <div className="bg-[#0b031a]/90 p-4 rounded-xl border border-pink-500/30 text-sm text-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className={`font-orbitron font-bold ${advice.color} text-xs block tracking-wide`}>
                {advice.title}
              </span>
              <p className="text-slate-200 leading-relaxed font-sans text-sm">
                {advice.msg}
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('quizzes');
              }}
              className="px-4 py-2.5 rounded-lg bg-pink-500/20 border border-pink-500/60 text-pink-200 font-orbitron text-xs font-semibold hover:bg-pink-500/30 whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              TAKE FINANCE QUIZ (+100 XP)
            </button>
          </div>
        )}
      </div>

      {/* Visual Analytics Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Spending by Category */}
        <div className="glass-vapor p-5 rounded-xl border border-cyan-500/40 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold font-orbitron text-cyan-200">
                CATEGORY SPENDING BREAKDOWN
              </h3>
            </div>
            <span className="text-xs text-pink-300 font-mono font-bold">
              ${totalExpenses} Total
            </span>
          </div>

          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0d041e" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#120428', 
                      borderColor: '#00f3ff', 
                      borderRadius: '8px', 
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'Inter' 
                    }}
                    formatter={(val) => [`$${val}`, 'Spent']}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter', paddingTop: '10px', color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-cyan-400/70 text-xs font-orbitron">
                NO EXPENSES LOGGED YET
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Category Budget vs Actual Spend */}
        <div className="glass-vapor p-5 rounded-xl border border-pink-500/40 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-400" />
              <h3 className="text-sm font-bold font-orbitron text-pink-200">
                BUDGET CAP VS ACTUAL SPENT
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('budgets')}
              className="text-xs text-cyan-300 hover:underline font-orbitron font-semibold cursor-pointer"
            >
              EDIT CAPS
            </button>
          </div>

          <div className="h-64 w-full">
            {budgetVsActualData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsActualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#94a3b8" tick={{ fill: '#00f3ff', fontSize: 11, fontFamily: 'Inter' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#ff007f', fontSize: 11, fontFamily: 'Inter' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#120428', 
                      borderColor: '#ff007f', 
                      borderRadius: '8px', 
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'Inter'
                    }}
                  />
                  <Bar dataKey="Spent" fill="#ff007f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Budget" fill="#00f3ff" opacity={0.5} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-pink-400/70 text-xs font-orbitron">
                NO CATEGORY DATA
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
