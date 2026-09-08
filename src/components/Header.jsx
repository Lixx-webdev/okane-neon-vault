import React from 'react';
import { soundFx } from '../utils/soundEffects';
import { getLevelInfo } from '../utils/storage';
import { 
  Zap, 
  Volume2, 
  VolumeX, 
  Tv, 
  Gamepad2, 
  HelpCircle, 
  Award, 
  PieChart, 
  Receipt, 
  Target,
  Download,
  RotateCcw
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  data, 
  setData, 
  onExport, 
  onReset 
}) {
  const levelInfo = getLevelInfo(data.xp);

  const toggleSound = () => {
    const nextMuted = !data.soundMuted;
    soundFx.setMuted(nextMuted);
    if (!nextMuted) soundFx.playClick();
    setData(prev => ({ ...prev, soundMuted: nextMuted }));
  };

  const toggleCRT = () => {
    soundFx.playClick();
    setData(prev => ({ ...prev, crtEnabled: !prev.crtEnabled }));
  };

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: PieChart },
    { id: 'transactions', label: 'LEDGER', icon: Receipt },
    { id: 'budgets', label: 'BUDGET VAULT', icon: Target },
    { id: 'quizzes', label: 'FINANCE QUIZ', icon: HelpCircle },
    { id: 'arcade', label: 'ARCADE GAMES', icon: Gamepad2 },
    { id: 'achievements', label: 'BADGES & RANKS', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 glass-vapor border-b border-pink-500/40 shadow-lg shadow-purple-950/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/30 flex items-center justify-center animate-pulse">
            <div className="w-full h-full bg-[#0d041e] rounded-[7px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-200 to-cyan-300 font-orbitron">
                NEON VAULT
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
                v2026.9
              </span>
            </div>
            <p className="text-xs text-cyan-200 font-medium tracking-wide">
              VAPORWAVE PERSONAL FINANCE
            </p>
          </div>
        </div>

        {/* Middle: Cyber Savings Level & XP Bar */}
        <div className="flex items-center gap-3 bg-[#13072b]/95 border border-cyan-500/40 rounded-xl px-4 py-2 shadow-inner min-w-[280px]">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-cyan-400">LVL</span>
            <span className="text-lg font-black text-pink-400 font-orbitron leading-none">
              {levelInfo.level}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-cyan-200 text-xs font-orbitron tracking-wide">
                {levelInfo.title}
              </span>
              <span className="text-xs text-pink-300 font-mono font-semibold">
                {levelInfo.xp} / {levelInfo.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full bg-purple-950/80 h-2.5 rounded-full overflow-hidden border border-cyan-500/40 p-0.5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${levelInfo.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Action Toggles & Tools */}
        <div className="flex items-center gap-2">
          {/* CRT Scanline Toggle */}
          <button 
            onClick={toggleCRT}
            title={data.crtEnabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              data.crtEnabled 
                ? 'bg-pink-500/20 text-pink-200 border-pink-500/60 shadow-[0_0_10px_rgba(255,0,127,0.3)]' 
                : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:text-cyan-300'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline font-orbitron text-xs">CRT</span>
          </button>

          {/* Sound Toggle */}
          <button 
            onClick={toggleSound}
            title={data.soundMuted ? "Unmute Audio" : "Mute Audio"}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              !data.soundMuted 
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/60 shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:text-pink-300'
            }`}
          >
            {data.soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline font-orbitron text-xs">
              {data.soundMuted ? 'MUTED' : 'AUDIO'}
            </span>
          </button>

          {/* Export JSON Data */}
          <button
            onClick={() => { soundFx.playClick(); onExport(); }}
            title="Backup Data (JSON)"
            className="p-2 rounded-lg bg-purple-900/50 text-purple-100 border border-purple-500/40 hover:bg-purple-800/70 hover:text-cyan-300 transition-all text-xs flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            <span className="hidden lg:inline font-orbitron text-xs">BACKUP</span>
          </button>

          {/* Reset Data */}
          <button
            onClick={() => {
              if (window.confirm("Reset all finance data, XP score and badges back to initial default state?")) {
                soundFx.playClick();
                onReset();
              }
            }}
            title="Reset to Defaults"
            className="p-2 rounded-lg bg-red-950/50 text-red-200 border border-red-500/40 hover:bg-red-900/70 transition-all text-xs flex items-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-pink-500/20 bg-[#0d041e]/95">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5 md:gap-3 overflow-x-auto scrollbar-none py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold tracking-wide font-orbitron transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-cyan-600/40 text-white border border-pink-400 shadow-[0_0_12px_rgba(255,0,127,0.35)]' 
                    : 'text-cyan-200/80 hover:text-white hover:bg-purple-900/30 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-cyan-400/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
