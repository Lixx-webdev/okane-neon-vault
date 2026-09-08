// LocalStorage Manager & Sample Data Provider for NEON VAULT

const STORAGE_KEY = 'NEON_VAULT_FINANCE_DATA_V1';

export const DEFAULT_CATEGORIES = [
  { id: 'cat_housing', name: 'Housing & Rent', color: '#ff007f', icon: 'Home' },
  { id: 'cat_food', name: 'Food & Dining', color: '#00f3ff', icon: 'Utensils' },
  { id: 'cat_tech', name: 'Tech & Cyberware', color: '#9d00ff', icon: 'Cpu' },
  { id: 'cat_ent', name: 'Arcade & Entertainment', color: '#ffea00', icon: 'Gamepad2' },
  { id: 'cat_bills', name: 'Utilities & Bills', color: '#ff5500', icon: 'Zap' },
  { id: 'cat_transport', name: 'Transport & Fuel', color: '#00ff88', icon: 'Car' },
  { id: 'cat_shopping', name: 'Shopping & Fashion', color: '#ff00bb', icon: 'ShoppingBag' },
  { id: 'cat_savings', name: 'Vault Savings Deposit', color: '#00e5ff', icon: 'PiggyBank' },
];

export const INITIAL_DATA = {
  monthlyIncomeTarget: 4500,
  xp: 520,
  level: 2,
  levelTitle: 'CYBER SAVER',
  crtEnabled: true,
  soundMuted: false,
  transactions: [
    { id: 'tx_1', type: 'income', title: 'Monthly Salary', amount: 4500, category: 'cat_savings', date: '2026-09-01', note: 'Direct deposit into main vault' },
    { id: 'tx_2', type: 'expense', title: 'Neon Condo Rent', amount: 1200, category: 'cat_housing', date: '2026-09-01', note: 'September rental payment' },
    { id: 'tx_3', type: 'expense', title: 'Synth Groceries', amount: 280, category: 'cat_food', date: '2026-09-03', note: 'Weekly organic groceries' },
    { id: 'tx_4', type: 'expense', title: 'Mechanical Keyboard Switch Pack', amount: 145, category: 'cat_tech', date: '2026-09-04', note: 'Custom synthware upgrade' },
    { id: 'tx_5', type: 'expense', title: 'Retro Arcade Night', amount: 65, category: 'cat_ent', date: '2026-09-05', note: 'Pinball & VR tokens' },
    { id: 'tx_6', type: 'expense', title: 'Grid Fiber Internet & Power', amount: 115, category: 'cat_bills', date: '2026-09-06', note: 'High speed grid subscription' },
    { id: 'tx_7', type: 'expense', title: 'Cyberpunk Jacket Sale', amount: 120, category: 'cat_shopping', date: '2026-09-06', note: 'Impulse discount purchase' },
    { id: 'tx_8', type: 'income', title: 'Freelance Web Coding', amount: 600, category: 'cat_savings', date: '2026-09-07', note: 'Side hustle reward' },
  ],
  categoryBudgets: {
    cat_housing: 1200,
    cat_food: 550,
    cat_tech: 250,
    cat_ent: 200,
    cat_bills: 150,
    cat_transport: 150,
    cat_shopping: 200,
  },
  savingsGoals: [
    { id: 'goal_1', title: '3-Month Emergency Matrix', target: 6000, current: 3800, color: '#00f3ff', icon: 'ShieldCheck' },
    { id: 'goal_2', title: 'Next-Gen Quantum GPU', target: 1200, current: 950, color: '#ff007f', icon: 'Monitor' },
    { id: 'goal_3', title: 'Tokyo Synthwave Tour', target: 3500, current: 1750, color: '#ffea00', icon: 'Plane' },
  ],
  completedQuizzes: ['q1_basics', 'q2_compound'],
  quizScores: {
    q1_basics: 100,
    q2_compound: 100,
  },
  unlockedBadges: ['badge_first_tx', 'badge_quiz_master', 'badge_saver_l2'],
  highScores: {
    budgetDefender: 1240,
    savingsCatcher: 860,
  }
};

export function loadFinanceData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saveFinanceData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(saved);
    return { ...INITIAL_DATA, ...parsed };
  } catch (err) {
    console.error('Failed to load local storage finance data', err);
    return INITIAL_DATA;
  }
}

export function saveFinanceData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save finance data to local storage', err);
  }
}

export function exportDataJSON(data) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `NEON_VAULT_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetFinanceData() {
  localStorage.removeItem(STORAGE_KEY);
  saveFinanceData(INITIAL_DATA);
  return INITIAL_DATA;
}

// XP Calculation for Levels
export function getLevelInfo(xp) {
  const levels = [
    { level: 1, title: 'NEON NOVICE', minXp: 0, maxXp: 300 },
    { level: 2, title: 'CYBER SAVER', minXp: 300, maxXp: 800 },
    { level: 3, title: 'SYNTH INVESTOR', minXp: 800, maxXp: 1500 },
    { level: 4, title: 'VAULT OVERLORD', minXp: 1500, maxXp: 2500 },
    { level: 5, title: 'VAPORWAVE TYCOON', minXp: 2500, maxXp: 5000 },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) {
      const currentLevel = levels[i];
      const nextLevel = levels[i + 1] || { maxXp: currentLevel.maxXp * 2, title: 'CYBER LEGEND' };
      const range = nextLevel.minXp - currentLevel.minXp;
      const progressInLevel = xp - currentLevel.minXp;
      const percentage = Math.min(100, Math.floor((progressInLevel / range) * 100));

      return {
        level: currentLevel.level,
        title: currentLevel.title,
        xp,
        minXp: currentLevel.minXp,
        nextLevelXp: nextLevel.minXp,
        percentage
      };
    }
  }

  return {
    level: 1,
    title: 'NEON NOVICE',
    xp,
    minXp: 0,
    nextLevelXp: 300,
    percentage: Math.min(100, Math.floor((xp / 300) * 100))
  };
}
