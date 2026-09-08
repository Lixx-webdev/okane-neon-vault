import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import BudgetVault from './components/BudgetVault';
import QuizArena from './components/QuizArena';
import ArcadeGames from './components/ArcadeGames';
import Achievements from './components/Achievements';
import AddTransactionModal from './components/AddTransactionModal';
import { 
  loadFinanceData, 
  saveFinanceData, 
  exportDataJSON, 
  resetFinanceData,
  getLevelInfo 
} from './utils/storage';
import { soundFx } from './utils/soundEffects';

export default function App() {
  const [data, setData] = useState(() => loadFinanceData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  // Sync audio state with data
  useEffect(() => {
    soundFx.setMuted(data.soundMuted);
  }, [data.soundMuted]);

  // Persist state changes to LocalStorage
  useEffect(() => {
    saveFinanceData(data);
  }, [data]);

  // Handle adding a new transaction
  const handleAddTransaction = (newTx) => {
    setData(prev => {
      const updatedTx = [newTx, ...prev.transactions];
      
      // Auto unlock 'badge_first_tx'
      let unlocked = prev.unlockedBadges || [];
      if (!unlocked.includes('badge_first_tx')) {
        unlocked = [...unlocked, 'badge_first_tx'];
      }

      return {
        ...prev,
        xp: prev.xp + 10,
        transactions: updatedTx,
        unlockedBadges: unlocked
      };
    });
  };

  // Export JSON backup
  const handleExport = () => {
    exportDataJSON(data);
  };

  // Reset to default sample data
  const handleReset = () => {
    const defaultData = resetFinanceData();
    setData(defaultData);
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${data.crtEnabled ? 'crt-overlay' : ''}`}>
      
      {/* Moving Vaporwave Grid Background */}
      <div className="retro-grid-bg" />
      <div className="perspective-grid" />

      {/* App Header Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        data={data} 
        setData={setData}
        onExport={handleExport}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            data={data} 
            onOpenAddTx={() => setIsAddTxOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionManager 
            data={data} 
            setData={setData}
            onOpenAddTx={() => setIsAddTxOpen(true)}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetVault 
            data={data} 
            setData={setData}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizArena 
            data={data} 
            setData={setData}
          />
        )}

        {activeTab === 'arcade' && (
          <ArcadeGames 
            data={data} 
            setData={setData}
          />
        )}

        {activeTab === 'achievements' && (
          <Achievements 
            data={data}
          />
        )}
      </main>

      {/* Modal: Add New Transaction */}
      <AddTransactionModal 
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onAddTx={handleAddTransaction}
      />

      {/* Retro Footer */}
      <footer className="relative z-10 border-t border-pink-500/20 py-6 text-center text-xs font-vt323 text-cyan-300/60">
        <p>NEON VAULT // VAPORWAVE PERSONAL FINANCE ARCHITECTURE // 2026</p>
        <p className="mt-0.5">LOCALSTORAGE PROTECTED // WEB AUDIO API ARCADES</p>
      </footer>
    </div>
  );
}
