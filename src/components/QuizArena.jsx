import React, { useState } from 'react';
import { soundFx } from '../utils/soundEffects';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  BookOpen, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QUIZ_DATA = [
  {
    id: 'q1_basics',
    title: 'Compound Interest & Time Horizons',
    category: 'FINANCE BASICS',
    xpReward: 100,
    description: 'Master the magic of compound growth and how starting early drastically increases long term savings wealth.',
    questions: [
      {
        question: 'What is compound interest in personal finance?',
        options: [
          'Interest earned only on your initial principal deposit',
          'Interest calculated on both initial principal and accumulated interest',
          'A penalty fee charged by banks for keeping savings idle',
          'A fixed rate tax levied on stock dividend returns'
        ],
        correct: 1,
        explanation: 'Compound interest is interest earned on both your principal deposit and the interest accumulated over time—often called "interest on interest".'
      },
      {
        question: 'If you invest $1,000 at an 8% annual return, approximately how many years will it take to double to $2,000 using the Rule of 72?',
        options: [
          '5 years',
          '9 years',
          '12 years',
          '15 years'
        ],
        correct: 1,
        explanation: 'The Rule of 72 states: 72 divided by the annual rate of return (72 / 8 = 9) gives the approximate number of years to double your money.'
      },
      {
        question: 'Which factor has the single greatest impact on compound growth potential?',
        options: [
          'Timing the daily stock market fluctuations',
          'Investing only in speculative high-risk cryptocurrencies',
          'Time horizon (starting as early as possible)',
          'Switching banks every month for promotional interest rates'
        ],
        correct: 2,
        explanation: 'Time horizon is key. The earlier you start investing, the more time compound interest has to multiply exponentially.'
      }
    ]
  },
  {
    id: 'q2_market_trends_2026',
    title: 'Market Trends 2026 & Inflation Hedging',
    category: 'MARKET TRENDS',
    xpReward: 100,
    description: 'Learn modern macroeconomic principles, inflation mechanics, and index fund diversification strategies.',
    questions: [
      {
        question: 'How does inflation affect the purchasing power of idle cash savings held in a 0% interest account?',
        options: [
          'It increases the purchasing power over time',
          'Purchasing power remains completely unchanged',
          'Purchasing power decreases over time as consumer prices rise',
          'The bank automatically converts idle cash into gold bullion'
        ],
        correct: 2,
        explanation: 'Inflation erodes purchasing power. If inflation is 3% per year, $100 sitting in a 0% account effectively loses 3% of real purchasing power annually.'
      },
      {
        question: 'What is a low-cost S&P 500 Index Fund / ETF?',
        options: [
          'A single high-risk tech startup company stock',
          'A basket of stock shares representing 500 of the largest publicly traded US companies',
          'A high-interest personal loan backed by real estate assets',
          'A government bond with zero yield'
        ],
        correct: 1,
        explanation: 'An S&P 500 Index Fund buys fractional shares in 500 top companies, offering instant broad market diversification with low management fees.'
      },
      {
        question: 'What is the primary benefit of Dollar-Cost Averaging (DCA)?',
        options: [
          'Guaranteed to buy stocks at the absolute lowest price every time',
          'Eliminates market volatility risk completely',
          'Builds disciplined investing by buying fixed dollar amounts regularly regardless of market ups and downs',
          'Allows you to trade options without margin accounts'
        ],
        correct: 2,
        explanation: 'DCA removes emotional timing mistakes by regularly investing a fixed amount, buying more shares when prices drop and fewer when prices rise.'
      }
    ]
  },
  {
    id: 'q3_budgeting_hacks',
    title: '50/30/20 Rule & Frugal Hacks',
    category: 'BUDGET MANAGEMENT',
    xpReward: 100,
    description: 'Deconstruct budget allocation frameworks and actionable tactics to cut recurring silent expenses.',
    questions: [
      {
        question: 'In the popular 50/30/20 budgeting rule, what does the 20% portion represent?',
        options: [
          'Wants and entertainment budget',
          'Essential needs like housing, groceries and utilities',
          'Savings, debt paydown beyond minimums, and investment goals',
          'Taxes and government fees'
        ],
        correct: 2,
        explanation: 'Under 50/30/20: 50% goes to Needs, 30% to Wants, and 20% strictly to Savings & Debt/Investments.'
      },
      {
        question: 'What is a "silent recurring subscription drain"?',
        options: [
          'A high-interest mortgage payment',
          'Unused monthly streaming, app, or gym memberships automatically charged to credit cards',
          'Utility bill price increases during winter months',
          'A bank fee for wire transfers'
        ],
        correct: 1,
        explanation: 'Unchecked recurring micro-subscriptions can quietly consume hundreds of dollars per year without providing active value.'
      }
    ]
  }
];

export default function QuizArena({ data, setData }) {
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuiz = QUIZ_DATA.find(q => q.id === activeQuizId);

  const startQuiz = (quizId) => {
    soundFx.playClick();
    setActiveQuizId(quizId);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const question = activeQuiz.questions[currentQIndex];
    if (index === question.correct) {
      soundFx.playQuizSuccess();
      setScore(prev => prev + 1);
    } else {
      soundFx.playQuizWrong();
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentQIndex + 1 < activeQuiz.questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      const totalQ = activeQuiz.questions.length;
      const passed = score >= Math.ceil(totalQ / 2);

      if (passed) {
        soundFx.playLevelUp();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

        setData(prev => {
          const isFirstTime = !prev.completedQuizzes.includes(activeQuiz.id);
          const xpGain = isFirstTime ? activeQuiz.xpReward : 30;

          return {
            ...prev,
            xp: prev.xp + xpGain,
            completedQuizzes: isFirstTime ? [...prev.completedQuizzes, activeQuiz.id] : prev.completedQuizzes,
            quizScores: { ...prev.quizScores, [activeQuiz.id]: Math.round((score / totalQ) * 100) }
          };
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-vapor p-5 rounded-2xl border border-pink-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/50 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-300">
              FINANCE & MARKET TRENDS QUIZ ARENA
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
              Test your financial knowledge, learn key wealth concepts & earn +100 Cyber XP per quiz!
            </p>
          </div>
        </div>
      </div>

      {/* Main Container: Quiz Selection or Active Quiz Game */}
      {!activeQuizId ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUIZ_DATA.map(quiz => {
            const isCompleted = data.completedQuizzes?.includes(quiz.id);
            const prevScore = data.quizScores?.[quiz.id];

            return (
              <div 
                key={quiz.id}
                className="bg-[#120428]/95 p-5 rounded-xl border border-cyan-500/40 hover:border-pink-400 transition-all flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-orbitron font-bold text-pink-300 bg-pink-500/15 px-2.5 py-1 rounded border border-pink-500/40">
                      {quiz.category}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-orbitron text-emerald-300 font-bold bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/40">
                        <Check className="w-3.5 h-3.5" /> PASSED ({prevScore}%)
                      </span>
                    )}
                  </div>

                  <h3 className="font-orbitron font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                    {quiz.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-300 font-sans mt-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                  <span className="text-xs font-orbitron font-bold text-yellow-300 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> +{quiz.xpReward} XP
                  </span>

                  <button
                    onClick={() => startQuiz(quiz.id)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-cyan-500 text-white font-orbitron text-xs font-bold shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {isCompleted ? 'REPLAY QUIZ' : 'START QUIZ'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Active Quiz Playing Interface */
        <div className="glass-vapor p-6 rounded-2xl border border-cyan-500/50 shadow-2xl max-w-3xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div>
              <span className="text-xs font-orbitron text-pink-300 font-bold tracking-wider uppercase">
                {activeQuiz.category}
              </span>
              <h3 className="text-base md:text-lg font-bold font-orbitron text-white">
                {activeQuiz.title}
              </h3>
            </div>

            <button
              onClick={() => setActiveQuizId(null)}
              className="text-xs text-cyan-300 hover:text-white font-orbitron font-semibold cursor-pointer"
            >
              EXIT QUIZ
            </button>
          </div>

          {!quizFinished ? (
            /* Question Body */
            <div className="space-y-6">
              
              {/* Progress & Question Title */}
              <div>
                <div className="flex justify-between items-center text-xs font-orbitron text-cyan-300 font-bold mb-2">
                  <span>QUESTION {currentQIndex + 1} OF {activeQuiz.questions.length}</span>
                  <span>SCORE: {score}</span>
                </div>

                <h4 className="text-base md:text-lg font-semibold text-slate-100 leading-snug">
                  {activeQuiz.questions[currentQIndex].question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {activeQuiz.questions[currentQIndex].options.map((opt, idx) => {
                  let btnStyle = "bg-[#120428] border-cyan-500/40 text-slate-100 hover:border-cyan-300";

                  if (isAnswered) {
                    if (idx === activeQuiz.questions[currentQIndex].correct) {
                      btnStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-100 font-semibold shadow-[0_0_15px_rgba(0,255,136,0.3)]";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-red-950/90 border-red-400 text-red-100 font-semibold";
                    } else {
                      btnStyle = "bg-[#120428]/40 border-slate-800 text-slate-400 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-sans transition-all flex items-start justify-between gap-3 ${btnStyle} cursor-pointer`}
                    >
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {isAnswered && idx === activeQuiz.questions[currentQIndex].correct && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== activeQuiz.questions[currentQIndex].correct && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Educational Explanation Box */}
              {isAnswered && (
                <div className="bg-[#160a2d] p-4 rounded-xl border border-pink-500/40 text-sm text-slate-200 space-y-1 animate-fade-in">
                  <span className="font-orbitron font-bold text-pink-300 flex items-center gap-1.5 text-xs">
                    <BookOpen className="w-4 h-4 text-pink-400" /> KNOWLEDGE DECRYPTION
                  </span>
                  <p className="font-sans leading-relaxed text-sm">
                    {activeQuiz.questions[currentQIndex].explanation}
                  </p>
                </div>
              )}

              {/* Next Question / Finish Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-orbitron font-bold text-xs shadow-lg shadow-pink-500/40 hover:brightness-110 transition-all cursor-pointer"
                  >
                    {currentQIndex + 1 < activeQuiz.questions.length ? 'NEXT QUESTION →' : 'VIEW QUIZ RESULTS'}
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Quiz Completed Score Summary */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 mx-auto flex items-center justify-center p-0.5 shadow-lg shadow-pink-500/50">
                <div className="w-full h-full bg-[#0d041e] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-yellow-300" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                  QUIZ TERMINATED
                </h3>
                <p className="text-sm text-slate-200 mt-1 font-medium">
                  Score: {score} / {activeQuiz.questions.length} Correct
                </p>
              </div>

              <div className="bg-[#120428] p-4 rounded-xl border border-cyan-500/40 max-w-sm mx-auto">
                <span className="text-xs font-orbitron text-yellow-300 font-bold block mb-1">
                  REWARD EARNED
                </span>
                <span className="text-lg font-black font-orbitron text-white">
                  +{activeQuiz.xpReward} CYBER XP
                </span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => startQuiz(activeQuiz.id)}
                  className="px-5 py-2.5 rounded-xl border border-cyan-500 text-cyan-300 font-orbitron text-xs hover:bg-cyan-500/20 cursor-pointer"
                >
                  RETRY QUIZ
                </button>
                <button
                  onClick={() => setActiveQuizId(null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 text-white font-orbitron text-xs font-bold shadow-lg cursor-pointer"
                >
                  RETURN TO ARENA
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
