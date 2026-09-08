import React, { useState } from 'react';
import { soundFx } from '../utils/soundEffects';
import { DEFAULT_CATEGORIES } from '../utils/storage';
import { 
  AlertTriangle, 
  Plus, 
  PiggyBank, 
  Edit3, 
  Check, 
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BudgetVault({ data, setData }) {
  const [editingBudgets, setEditingBudgets] = useState(false);
  const [tempBudgets, setTempBudgets] = useState(data.categoryBudgets);
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [newGoalModal, setNewGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  // Save budget edits
  const handleSaveBudgets = () => {
    soundFx.playClick();
    setData(prev => ({
      ...prev,
      categoryBudgets: tempBudgets
    }));
    setEditingBudgets(false);
  };

  // Deposit funds to a savings goal
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return;

    soundFx.playCoin();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setData(prev => {
      const updatedGoals = prev.savingsGoals.map(g => {
        if (g.id === depositGoalId) {
          return { ...g, current: g.current + amount };
        }
        return g;
      });

      const newTx = {
        id: `tx_${Date.now()}`,
        type: 'expense',
        title: `Vault Deposit: ${prev.savingsGoals.find(g => g.id === depositGoalId)?.title}`,
        amount: amount,
        category: 'cat_savings',
        date: new Date().toISOString().slice(0, 10),
        note: 'Automated transfer to savings goal'
      };

      return {
        ...prev,
        xp: prev.xp + 50,
        savingsGoals: updatedGoals,
        transactions: [newTx, ...prev.transactions]
      };
    });

    setDepositGoalId(null);
    setDepositAmount('');
  };

  // Add new savings goal
  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTarget) return;

    soundFx.playCoin();
    const newGoal = {
      id: `goal_${Date.now()}`,
      title: newGoalTitle,
      target: Number(newGoalTarget),
      current: 0,
      color: '#00f3ff'
    };

    setData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal]
    }));

    setNewGoalModal(false);
    setNewGoalTitle('');
    setNewGoalTarget('');
  };

  return (
    <div className="space-y-8">
      
      {/* Category Budget Caps Module */}
      <div className="glass-vapor p-5 rounded-2xl border border-pink-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/20 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-cyan-300">
              CATEGORY BUDGET CAPS
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
              Set monthly spending limits to prevent budget overruns and unlock Cyber Saver XP bonuses.
            </p>
          </div>

          {editingBudgets ? (
            <button
              onClick={handleSaveBudgets}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold font-orbitron text-xs shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>SAVE CAPS</span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                setTempBudgets(data.categoryBudgets);
                setEditingBudgets(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-900/50 border border-purple-500/50 text-purple-200 font-orbitron text-xs font-semibold hover:bg-purple-800/60 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>EDIT CAPS</span>
            </button>
          )}
        </div>

        {/* Budget Caps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_CATEGORIES.map(cat => {
            const spent = data.transactions
              .filter(t => t.type === 'expense' && t.category === cat.id)
              .reduce((sum, t) => sum + Number(t.amount), 0);

            const cap = editingBudgets ? tempBudgets[cat.id] || 0 : data.categoryBudgets[cat.id] || 0;
            const percentage = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
            const isOver = spent > cap && cap > 0;

            return (
              <div 
                key={cat.id} 
                className={`p-4 rounded-xl border transition-all ${
                  isOver 
                    ? 'bg-red-950/40 border-red-500/70 shadow-[0_0_15px_rgba(255,0,0,0.3)]' 
                    : 'bg-[#120428]/90 border-cyan-500/40 hover:border-cyan-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shadow-glow" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="font-orbitron font-bold text-xs text-white">
                      {cat.name}
                    </span>
                  </div>

                  <div className="text-right">
                    {editingBudgets ? (
                      <input 
                        type="number" 
                        value={cap} 
                        onChange={(e) => setTempBudgets({ ...tempBudgets, [cat.id]: Number(e.target.value) })}
                        className="w-24 bg-[#0b031a] border border-pink-500/60 rounded px-2 py-0.5 text-xs text-right font-mono text-cyan-300 font-bold"
                      />
                    ) : (
                      <span className="font-orbitron text-xs font-bold text-cyan-200">
                        ${spent} / <span className="text-cyan-400/80">${cap}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900/90 h-3 rounded-full overflow-hidden border border-cyan-500/30 p-0.5 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver 
                        ? 'bg-gradient-to-r from-red-600 to-pink-500 animate-pulse' 
                        : percentage >= 80 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono font-medium mt-1.5 text-slate-300">
                  <span>{percentage}% Used</span>
                  {isOver && (
                    <span className="text-pink-300 font-bold flex items-center gap-1 font-orbitron animate-pulse text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" /> OVER BUDGET (${spent - cap})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Goals Matrix ("Vault Goals") */}
      <div className="glass-vapor p-5 rounded-2xl border border-cyan-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-yellow-200 to-pink-300">
              SAVINGS GOAL MATRIX
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
              Direct money towards long-term emergency funds and tech upgrades (+50 XP per deposit).
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setNewGoalModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold font-orbitron text-xs shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>NEW GOAL</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.savingsGoals.map(goal => {
            const goalProgress = Math.min(100, Math.round((goal.current / goal.target) * 100));

            return (
              <div 
                key={goal.id} 
                className="bg-[#120428]/95 p-5 rounded-xl border border-cyan-500/40 hover:border-cyan-300 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                      <PiggyBank className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-xs font-mono font-bold text-yellow-300 px-2 py-1 rounded bg-yellow-500/15 border border-yellow-500/40">
                      {goalProgress}%
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-sm text-white mb-1">
                    {goal.title}
                  </h3>

                  <div className="text-lg font-black font-orbitron text-cyan-300 my-1">
                    ${goal.current.toLocaleString()} <span className="text-xs text-slate-300 font-normal">/ ${goal.target.toLocaleString()}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-cyan-500/40 p-0.5 my-2">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDepositGoalId(goal.id);
                  }}
                  className="w-full py-2.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/60 text-pink-200 font-orbitron text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Coins className="w-4 h-4 text-pink-400" />
                  <span>DEPOSIT FUNDS (+50 XP)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Deposit Funds */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="glass-vapor p-6 rounded-2xl border border-pink-500/60 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300">
              DEPOSIT TO SAVINGS VAULT
            </h3>
            <p className="text-xs md:text-sm text-slate-200">
              Transfer funds into your selected goal matrix. This will generate a transaction entry and add +50 Cyber XP!
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
                  DEPOSIT AMOUNT ($)
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 150"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-orbitron text-xs hover:bg-slate-900 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 text-white font-orbitron text-xs font-bold shadow-lg shadow-pink-500/40 hover:brightness-110 cursor-pointer"
                >
                  CONFIRM DEPOSIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Goal */}
      {newGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="glass-vapor p-6 rounded-2xl border border-cyan-500/60 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black font-orbitron text-cyan-200">
              CREATE NEW SAVINGS GOAL
            </h3>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
                  GOAL TITLE
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Vintage Synth Keyboard"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
                  TARGET AMOUNT ($)
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 2000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewGoalModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-orbitron text-xs hover:bg-slate-900 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-orbitron text-xs font-bold shadow-lg shadow-cyan-500/40 hover:brightness-110 cursor-pointer"
                >
                  CREATE GOAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
