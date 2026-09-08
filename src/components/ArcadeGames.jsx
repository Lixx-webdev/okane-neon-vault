import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundEffects';
import { Gamepad2, Play, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ArcadeGames({ data, setData }) {
  const [selectedGame, setSelectedGame] = useState('defender');
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(data.highScores?.budgetDefender || 0);

  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  const shipRef = useRef({ x: 300, y: 350, width: 36, height: 36, speed: 7 });
  const lasersRef = useRef([]);
  const enemiesRef = useRef([]);
  const crystalsRef = useRef([]);
  const keysRef = useRef({});

  const basketRef = useRef({ x: 300, y: 360, width: 70, height: 20, speed: 8 });
  const fallingItemsRef = useRef([]);

  useEffect(() => {
    if (selectedGame === 'defender') {
      setHighScore(data.highScores?.budgetDefender || 0);
    } else {
      setHighScore(data.highScores?.savingsCatcher || 0);
    }
  }, [selectedGame, data.highScores]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Space' && gameState === 'playing' && selectedGame === 'defender') {
        soundFx.playLaser();
        lasersRef.current.push({
          x: shipRef.current.x + shipRef.current.width / 2 - 2,
          y: shipRef.current.y,
          width: 4,
          height: 14,
          speed: 9
        });
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, selectedGame]);

  const startGame = () => {
    soundFx.playClick();
    setGameState('playing');
    setScore(0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    shipRef.current = { x: canvas.width / 2 - 18, y: canvas.height - 50, width: 36, height: 36, speed: 7 };
    basketRef.current = { x: canvas.width / 2 - 35, y: canvas.height - 35, width: 70, height: 20, speed: 8 };

    lasersRef.current = [];
    enemiesRef.current = [];
    crystalsRef.current = [];
    fallingItemsRef.current = [];

    if (selectedGame === 'defender') {
      runDefenderLoop();
    } else {
      runCatcherLoop();
    }
  };

  const runDefenderLoop = () => {
    let currentScore = 0;
    let spawnTimer = 0;

    const update = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0d041e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
        shipRef.current.x = Math.max(10, shipRef.current.x - shipRef.current.speed);
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
        shipRef.current.x = Math.min(canvas.width - shipRef.current.width - 10, shipRef.current.x + shipRef.current.speed);
      }

      ctx.fillStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(shipRef.current.x + shipRef.current.width / 2, shipRef.current.y);
      ctx.lineTo(shipRef.current.x, shipRef.current.y + shipRef.current.height);
      ctx.lineTo(shipRef.current.x + shipRef.current.width, shipRef.current.y + shipRef.current.height);
      ctx.closePath();
      ctx.fill();

      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        enemiesRef.current.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          width: 28,
          height: 28,
          speed: 2.5 + Math.random() * 2,
          label: ['Impulse Buy', 'Takeout', 'Flash Sale', 'Subscriptions'][Math.floor(Math.random() * 4)]
        });
      }

      if (spawnTimer % 90 === 0) {
        crystalsRef.current.push({
          x: Math.random() * (canvas.width - 25),
          y: -25,
          width: 24,
          height: 24,
          speed: 2,
          label: '+SAVINGS'
        });
      }

      lasersRef.current.forEach((l, lIdx) => {
        l.y -= l.speed;
        ctx.fillStyle = '#ff007f';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 8;
        ctx.fillRect(l.x, l.y, l.width, l.height);

        enemiesRef.current.forEach((e, eIdx) => {
          if (
            l.x < e.x + e.width &&
            l.x + l.width > e.x &&
            l.y < e.y + e.height &&
            l.y + l.height > e.y
          ) {
            soundFx.playExplosion();
            currentScore += 50;
            setScore(currentScore);
            lasersRef.current.splice(lIdx, 1);
            enemiesRef.current.splice(eIdx, 1);
          }
        });
      });

      lasersRef.current = lasersRef.current.filter(l => l.y > -20);

      enemiesRef.current.forEach((e, eIdx) => {
        e.y += e.speed;

        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 12;
        ctx.fillRect(e.x, e.y, e.width, e.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.fillText(e.label, e.x - 10, e.y - 4);

        if (
          shipRef.current.x < e.x + e.width &&
          shipRef.current.x + shipRef.current.width > e.x &&
          shipRef.current.y < e.y + e.height &&
          shipRef.current.y + shipRef.current.height > e.y
        ) {
          endGame(currentScore, 'budgetDefender');
          return;
        }

        if (e.y > canvas.height + 30) {
          enemiesRef.current.splice(eIdx, 1);
        }
      });

      crystalsRef.current.forEach((c, cIdx) => {
        c.y += c.speed;

        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(c.x + 12, c.y + 12, 12, 0, Math.PI * 2);
        ctx.fill();

        if (
          shipRef.current.x < c.x + c.width &&
          shipRef.current.x + shipRef.current.width > c.x &&
          shipRef.current.y < c.y + c.height &&
          shipRef.current.y + shipRef.current.height > c.y
        ) {
          soundFx.playCoin();
          currentScore += 100;
          setScore(currentScore);
          crystalsRef.current.splice(cIdx, 1);
        }

        if (c.y > canvas.height + 30) {
          crystalsRef.current.splice(cIdx, 1);
        }
      });

      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 0;
      ctx.font = 'bold 14px Orbitron';
      ctx.fillText(`SCORE: ${currentScore}`, 15, 30);

      animFrameId.current = requestAnimationFrame(update);
    };

    animFrameId.current = requestAnimationFrame(update);
  };

  const runCatcherLoop = () => {
    let currentScore = 0;
    let spawnTimer = 0;

    const update = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0d041e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
        basketRef.current.x = Math.max(10, basketRef.current.x - basketRef.current.speed);
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
        basketRef.current.x = Math.min(canvas.width - basketRef.current.width - 10, basketRef.current.x + basketRef.current.speed);
      }

      ctx.fillStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(basketRef.current.x, basketRef.current.y, basketRef.current.width, basketRef.current.height);

      spawnTimer++;
      if (spawnTimer % 35 === 0) {
        const isGood = Math.random() > 0.3;
        fallingItemsRef.current.push({
          x: Math.random() * (canvas.width - 25),
          y: -25,
          radius: 12,
          speed: 3 + Math.random() * 2,
          type: isGood ? 'coin' : 'trap'
        });
      }

      fallingItemsRef.current.forEach((item, idx) => {
        item.y += item.speed;

        if (item.type === 'coin') {
          ctx.fillStyle = '#00ff88';
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ff007f';
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 8;
          ctx.fillRect(item.x - 10, item.y - 10, 20, 20);
        }

        if (
          item.y + item.radius >= basketRef.current.y &&
          item.x >= basketRef.current.x &&
          item.x <= basketRef.current.x + basketRef.current.width
        ) {
          if (item.type === 'coin') {
            soundFx.playCoin();
            currentScore += 30;
          } else {
            soundFx.playQuizWrong();
            currentScore = Math.max(0, currentScore - 20);
          }
          setScore(currentScore);
          fallingItemsRef.current.splice(idx, 1);
        }

        if (item.y > canvas.height + 20) {
          fallingItemsRef.current.splice(idx, 1);
        }
      });

      ctx.fillStyle = '#00ff88';
      ctx.shadowBlur = 0;
      ctx.font = 'bold 14px Orbitron';
      ctx.fillText(`SAVINGS SCORE: ${currentScore}`, 15, 30);

      if (spawnTimer >= 30 * 60) {
        endGame(currentScore, 'savingsCatcher');
        return;
      }

      animFrameId.current = requestAnimationFrame(update);
    };

    animFrameId.current = requestAnimationFrame(update);
  };

  const endGame = (finalScore, gameKey) => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    soundFx.playLevelUp();
    setGameState('gameover');

    const xpEarned = Math.round(finalScore / 2);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

    setData(prev => {
      const prevHighScore = prev.highScores?.[gameKey] || 0;
      const newHigh = Math.max(prevHighScore, finalScore);

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        highScores: { ...prev.highScores, [gameKey]: newHigh }
      };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="glass-vapor p-5 rounded-2xl border border-pink-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-200">
              CYBER ARCADE GAMIFICATION
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
              Play retro arcade mini-games to shoot impulse expenses, collect savings & score Cyber XP!
            </p>
          </div>
        </div>

        {/* Game Selector Tabs */}
        <div className="flex items-center gap-2 bg-[#0d041e] border border-cyan-500/40 p-1.5 rounded-xl">
          <button
            onClick={() => {
              if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
              soundFx.playClick();
              setSelectedGame('defender');
              setGameState('idle');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer ${
              selectedGame === 'defender' ? 'bg-pink-500/30 text-pink-200 border border-pink-500/60' : 'text-cyan-200/70 hover:text-white'
            }`}
          >
            BUDGET DEFENDER
          </button>
          <button
            onClick={() => {
              if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
              soundFx.playClick();
              setSelectedGame('catcher');
              setGameState('idle');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer ${
              selectedGame === 'catcher' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/60' : 'text-cyan-200/70 hover:text-white'
            }`}
          >
            SAVINGS CATCHER
          </button>
        </div>
      </div>

      {/* Canvas Arcade Display */}
      <div className="glass-vapor p-6 rounded-2xl border border-cyan-500/50 shadow-2xl flex flex-col items-center justify-center space-y-4">
        
        {/* Top Controls info */}
        <div className="flex justify-between items-center w-full max-w-xl text-xs font-orbitron text-cyan-200 font-bold border-b border-cyan-500/20 pb-2">
          <span>HIGH SCORE: {highScore}</span>
          <span className="text-pink-300">CONTROLS: A/D OR ARROW KEYS (SPACE TO SHOOT)</span>
        </div>

        {/* Canvas Element */}
        <div className="relative border-2 border-pink-500/60 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,0,127,0.3)] bg-[#0d041e]">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full max-w-xl h-auto aspect-[3/2] block"
          />

          {/* Start Screen Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-[#0d041e]/90 flex flex-col items-center justify-center space-y-4 p-6 text-center">
              <h3 className="text-2xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-300">
                {selectedGame === 'defender' ? 'BUDGET DEFENDER' : 'SAVINGS CATCHER'}
              </h3>
              <p className="text-sm text-slate-200 max-w-md leading-relaxed">
                {selectedGame === 'defender' 
                  ? 'Destroy impulse purchase asteroids with your laser cannon while harvesting glowing savings crystals!'
                  : 'Move your vault pad left and right to catch green savings coins while dodging impulse debt traps!'}
              </p>

              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-orbitron font-bold text-sm shadow-lg shadow-pink-500/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>START GAME</span>
              </button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-[#0d041e]/95 flex flex-col items-center justify-center space-y-4 p-6 text-center animate-fade-in">
              <h3 className="text-2xl font-black font-orbitron text-pink-400 neon-text-pink">
                GAME OVER
              </h3>
              <div className="text-base font-orbitron font-bold text-white">
                SCORE: {score} <span className="text-xs text-yellow-300">(+{Math.round(score / 2)} XP REWARDED!)</span>
              </div>

              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-pink-600 text-white font-orbitron font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Mobile Touch Buttons */}
        <div className="flex items-center gap-3 w-full max-w-xl justify-center pt-2">
          <button
            onMouseDown={() => { keysRef.current['ArrowLeft'] = true; }}
            onMouseUp={() => { keysRef.current['ArrowLeft'] = false; }}
            onTouchStart={() => { keysRef.current['ArrowLeft'] = true; }}
            onTouchEnd={() => { keysRef.current['ArrowLeft'] = false; }}
            className="flex-1 py-3 bg-purple-900/50 border border-purple-500/40 rounded-xl text-cyan-200 font-orbitron font-bold text-sm active:bg-pink-500/30 cursor-pointer"
          >
            ← LEFT
          </button>

          {selectedGame === 'defender' && (
            <button
              onClick={() => {
                if (gameState === 'playing') {
                  soundFx.playLaser();
                  lasersRef.current.push({
                    x: shipRef.current.x + shipRef.current.width / 2 - 2,
                    y: shipRef.current.y,
                    width: 4,
                    height: 14,
                    speed: 9
                  });
                }
              }}
              className="flex-1 py-3 bg-pink-500/30 border border-pink-500/60 rounded-xl text-pink-200 font-orbitron font-bold text-sm active:bg-pink-500/50 cursor-pointer"
            >
              ⚡ SHOOT
            </button>
          )}

          <button
            onMouseDown={() => { keysRef.current['ArrowRight'] = true; }}
            onMouseUp={() => { keysRef.current['ArrowRight'] = false; }}
            onTouchStart={() => { keysRef.current['ArrowRight'] = true; }}
            onTouchEnd={() => { keysRef.current['ArrowRight'] = false; }}
            className="flex-1 py-3 bg-purple-900/50 border border-purple-500/40 rounded-xl text-cyan-200 font-orbitron font-bold text-sm active:bg-pink-500/30 cursor-pointer"
          >
            RIGHT →
          </button>
        </div>

      </div>
    </div>
  );
}
