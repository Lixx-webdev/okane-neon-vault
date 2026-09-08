import React, { useState } from 'react';
import { soundFx } from '../utils/soundEffects';
import { DEFAULT_CATEGORIES } from '../utils/storage';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddTransactionModal({ isOpen, onClose, onAddTx }) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    soundFx.playCoin();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });

    const newTx = {
      id: `tx_${Date.now()}`,
      type,
      title,
      amount: Number(amount),
      category,
      date,
      note
    };

    onAddTx(newTx);
    onClose();

    setTitle('');
    setAmount('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="glass-vapor p-6 rounded-2xl border border-pink-500/60 max-w-lg w-full shadow-2xl space-y-4 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-500/30 pb-3">
          <h3 className="text-lg font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300">
            LOG NEW TRANSACTION
          </h3>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-pink-500/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Toggle: Income vs Expense */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0d041e] border border-cyan-500/40 rounded-xl">
            <button
              type="button"
              onClick={() => { soundFx.playClick(); setType('expense'); }}
              className={`py-2 text-xs font-orbitron font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense' 
                  ? 'bg-pink-500/30 text-pink-200 border border-pink-500/60 shadow-[0_0_10px_rgba(255,0,127,0.3)]' 
                  : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              EXPENSE OUTFLOW
            </button>
            <button
              type="button"
              onClick={() => { soundFx.playClick(); setType('income'); }}
              className={`py-2 text-xs font-orbitron font-bold rounded-lg transition-all cursor-pointer ${
                type === 'income' 
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                  : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              INCOME DEPOSIT
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
              DESCRIPTION / TITLE
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Cyberpunk Jacket / Freelance Coding"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
                AMOUNT ($)
              </label>
              <input 
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
                DATE
              </label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
            >
              {DEFAULT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-orbitron text-cyan-300 font-semibold mb-1">
              NOTE / REASON (OPTIONAL)
            </label>
            <input 
              type="text"
              placeholder="e.g. 20% discount sale item"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs font-normal text-slate-200 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => { soundFx.playClick(); onClose(); }}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-orbitron text-xs hover:bg-slate-900 cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-orbitron text-xs font-bold shadow-lg shadow-pink-500/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              COMMIT ENTRY (+10 XP)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
