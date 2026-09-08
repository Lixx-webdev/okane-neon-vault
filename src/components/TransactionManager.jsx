import React, { useState } from 'react';
import { soundFx } from '../utils/soundEffects';
import { DEFAULT_CATEGORIES } from '../utils/storage';
import { 
  Plus, 
  Trash2, 
  Search, 
  ArrowUpCircle, 
  ArrowDownCircle
} from 'lucide-react';

export default function TransactionManager({ data, setData, onOpenAddTx }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction record?')) {
      soundFx.playClick();
      setData(prev => ({
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id)
      }));
    }
  };

  // Filter logic
  const filteredTransactions = data.transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const getCategoryObj = (catId) => {
    return DEFAULT_CATEGORIES.find(c => c.id === catId) || { name: 'General', color: '#ff007f' };
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="glass-vapor p-5 rounded-2xl border border-cyan-500/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300">
              TRANSACTION LEDGER
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
              Inspect, filter and manage all logged income deposits and expense outflows.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenAddTx();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 text-white font-bold font-orbitron text-xs shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>NEW ENTRY</span>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-cyan-500/20">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-cyan-400/70" />
            <input 
              type="text"
              placeholder="Search description or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-[#0d041e] border border-cyan-500/40 rounded-xl p-1">
            <button
              onClick={() => { soundFx.playClick(); setFilterType('all'); }}
              className={`flex-1 py-1.5 text-xs font-orbitron font-semibold rounded-lg transition-all ${
                filterType === 'all' ? 'bg-pink-500/30 text-pink-200 border border-pink-500/60' : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => { soundFx.playClick(); setFilterType('income'); }}
              className={`flex-1 py-1.5 text-xs font-orbitron font-semibold rounded-lg transition-all ${
                filterType === 'income' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/60' : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              INCOME
            </button>
            <button
              onClick={() => { soundFx.playClick(); setFilterType('expense'); }}
              className={`flex-1 py-1.5 text-xs font-orbitron font-semibold rounded-lg transition-all ${
                filterType === 'expense' ? 'bg-pink-500/30 text-pink-200 border border-pink-500/60' : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              EXPENSE
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => { soundFx.playClick(); setFilterCategory(e.target.value); }}
              className="w-full bg-[#0d041e] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-orbitron text-slate-100 focus:outline-none focus:border-pink-500"
            >
              <option value="all">ALL CATEGORIES</option>
              {DEFAULT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-vapor rounded-2xl border border-pink-500/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#120428]/95 border-b border-pink-500/30 text-xs font-orbitron text-cyan-200 font-bold">
                <th className="p-3.5">TYPE</th>
                <th className="p-3.5">TITLE & NOTE</th>
                <th className="p-3.5">CATEGORY</th>
                <th className="p-3.5">DATE</th>
                <th className="p-3.5 text-right">AMOUNT</th>
                <th className="p-3.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-500/10 text-sm font-sans">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => {
                  const categoryObj = getCategoryObj(tx.category);
                  const isIncome = tx.type === 'income';

                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-purple-950/40 transition-colors group"
                    >
                      {/* Type Icon */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isIncome ? (
                          <span className="flex items-center gap-1.5 text-emerald-300 font-orbitron text-xs font-semibold bg-emerald-500/15 px-2.5 py-1 rounded-md border border-emerald-500/40">
                            <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                            INCOME
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-pink-300 font-orbitron text-xs font-semibold bg-pink-500/15 px-2.5 py-1 rounded-md border border-pink-500/40">
                            <ArrowDownCircle className="w-4 h-4 text-pink-400" />
                            EXPENSE
                          </span>
                        )}
                      </td>

                      {/* Title & Note */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-100 text-sm">
                          {tx.title}
                        </div>
                        {tx.note && (
                          <div className="text-xs text-slate-300 font-normal mt-0.5">
                            {tx.note}
                          </div>
                        )}
                      </td>

                      {/* Category Tag */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span 
                          className="px-2.5 py-1 rounded-md text-xs font-orbitron font-bold border"
                          style={{ 
                            borderColor: categoryObj.color, 
                            color: categoryObj.color, 
                            backgroundColor: `${categoryObj.color}20` 
                          }}
                        >
                          {categoryObj.name}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-300 font-mono text-xs whitespace-nowrap font-medium">
                        {tx.date}
                      </td>

                      {/* Amount */}
                      <td className="p-3.5 text-right font-bold font-orbitron text-sm whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-300' : 'text-pink-300'}>
                          {isIncome ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/20 transition-all cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-cyan-300/80 font-orbitron text-xs">
                    NO TRANSACTIONS MATCH CURRENT FILTER
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
