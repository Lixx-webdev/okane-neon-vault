import React from 'react';
import { getLevelInfo } from '../utils/storage';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Gamepad2, 
  HelpCircle,
  PiggyBank,
  TrendingUp
} from 'lucide-react';

export const BADGES = [
  {
    id: 'badge_first_tx',
    title: 'FIRST LOG ENTRY',
    icon: Zap,
    description: 'Log your very first transaction entry in the ledger.',
    requirement: 'Log 1 transaction',
    color: '#00f3ff'
  },
  {
    id: 'badge_quiz_master',
    title: 'QUIZ MASTER',
    icon: HelpCircle,
    description: 'Complete 2 or more finance and market trend quizzes in the arena.',
    requirement: 'Pass 2 finance quizzes',
    color: '#ff007f'
  },
  {
    id: 'badge_saver_l2',
    title: 'CYBER SAVER',
    icon: ShieldCheck,
    description: 'Reach Cyber Savings Level 2 by accumulating 300+ XP.',
    requirement: 'Reach Level 2',
    color: '#ffea00'
  },
  {
    id: 'badge_arcade_hero',
    title: 'ARCADE LEGEND',
    icon: Gamepad2,
    description: 'Score over 500 points in the Budget Defender arcade game.',
    requirement: 'Score 500+ in Arcade',
    color: '#00ff88'
  },
  {
    id: 'badge_vault_master',
    title: 'VAULT GUARDIAN',
    icon: PiggyBank,
    description: 'Make a deposit into any long-term Savings Goal matrix.',
    requirement: 'Deposit into Savings Goal',
    color: '#ff00bb'
  },
  {
    id: 'badge_tycoon',
    title: 'VAPORWAVE TYCOON',
    icon: TrendingUp,
    description: 'Reach maximum level Cyber Tycoon rank with 2,500+ XP.',
    requirement: 'Reach Level 5',
    color: '#9d00ff'
  }
];

export default function Achievements({ data }) {
  const levelInfo = getLevelInfo(data.xp);

  const ranks = [
    { level: 1, title: 'NEON NOVICE', xp: '0 - 299 XP', desc: 'Starting your cyber financial journey.' },
    { level: 2, title: 'CYBER SAVER', xp: '300 - 799 XP', desc: 'Establishing disciplined savings habits.' },
    { level: 3, title: 'SYNTH INVESTOR', xp: '800 - 1,499 XP', desc: 'Understanding compound growth & market trends.' },
    { level: 4, title: 'VAULT OVERLORD', xp: '1,500 - 2,499 XP', desc: 'Master of monthly category budgets & goals.' },
    { level: 5, title: 'VAPORWAVE TYCOON', xp: '2,500+ XP', desc: 'Ultimate financial freedom & high vault efficiency.' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="glass-vapor p-5 rounded-2xl border border-cyan-500/40 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/50 flex items-center justify-center">
          <Award className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-300">
            BADGES & CYBER SAVER RANKS
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
            Track unlocked achievement badges and your progression through the Cyber Saver levels.
          </p>
        </div>
      </div>

      {/* Ranks Progression */}
      <div className="glass-vapor p-6 rounded-2xl border border-pink-500/30 shadow-xl space-y-4">
        <h3 className="text-sm font-bold font-orbitron text-cyan-200 border-b border-cyan-500/20 pb-2">
          CYBER LEVEL RANKS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ranks.map(r => {
            const isCurrentRank = levelInfo.level === r.level;
            const isPassedRank = levelInfo.level > r.level;

            return (
              <div 
                key={r.level}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrentRank 
                    ? 'bg-pink-500/20 border-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.4)]' 
                    : isPassedRank 
                      ? 'bg-[#120428]/90 border-cyan-500/40 opacity-80' 
                      : 'bg-[#0d041e]/50 border-slate-800 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-orbitron text-pink-300 font-bold mb-1">
                  <span>LVL {r.level}</span>
                  {isCurrentRank && (
                    <span className="text-[10px] bg-pink-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="font-orbitron font-bold text-xs text-white">
                  {r.title}
                </div>
                <div className="text-xs text-cyan-300 font-mono mt-0.5 font-semibold">
                  {r.xp}
                </div>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-snug">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Gallery Grid */}
      <div className="glass-vapor p-6 rounded-2xl border border-cyan-500/40 shadow-xl space-y-4">
        <h3 className="text-sm font-bold font-orbitron text-pink-200 border-b border-pink-500/20 pb-2">
          ACHIEVEMENT BADGES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map(badge => {
            const Icon = badge.icon;
            const isUnlocked = data.unlockedBadges?.includes(badge.id) || levelInfo.level >= 2 && badge.id === 'badge_saver_l2';

            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked 
                    ? 'bg-[#120428]/95 border-cyan-500/50 shadow-lg' 
                    : 'bg-[#0d041e]/40 border-slate-800 opacity-50'
                }`}
              >
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked ? 'bg-cyan-500/20 border-cyan-400 shadow-glow' : 'bg-slate-900 border-slate-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isUnlocked ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron font-bold text-xs text-white">
                      {badge.title}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {badge.description}
                  </p>

                  <span className="text-xs font-mono text-pink-300 font-bold block pt-1">
                    Req: {badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
