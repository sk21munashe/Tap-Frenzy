import { useState, useCallback, useEffect, useRef } from 'react';

interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  color: 'cyan' | 'magenta' | 'yellow';
  points: number;
  createdAt: number;
  lifetime: number;
}

interface ScorePopup {
  id: string;
  x: number;
  y: number;
  points: number;
  combo: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
}

type GameState = 'start' | 'playing' | 'gameOver';

const STORAGE_KEY = 'tap-frenzy-high-score';
const MAX_LIVES = 3;
const BASE_SPAWN_RATE = 1500;
const MIN_SPAWN_RATE = 400;
const COMBO_TIMEOUT = 1500;

const TARGET_CONFIGS = [
  { color: 'cyan' as const, points: 10, size: 60, weight: 60, lifetime: 2000 },
  { color: 'magenta' as const, points: 25, size: 50, weight: 30, lifetime: 1500 },
  { color: 'yellow' as const, points: 50, size: 40, weight: 10, lifetime: 1000 },
];

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const comboTimeoutRef = useRef<number | undefined>(undefined);
  const spawnIntervalRef = useRef<number | undefined>(undefined);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomTarget = useCallback((): Omit<Target, 'id' | 'createdAt'> => {
    const totalWeight = TARGET_CONFIGS.reduce((sum: number, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    let config = TARGET_CONFIGS[0];
    for (const t of TARGET_CONFIGS) {
      random -= t.weight;
      if (random <= 0) {
        config = t;
        break;
      }
    }

    const container = containerRef.current;
    const padding = 100;
    const maxX = (container?.clientWidth || 400) - config.size - padding;
    const maxY = (container?.clientHeight || 600) - config.size - padding * 2;

    return {
      x: padding + Math.random() * Math.max(100, maxX),
      y: padding + Math.random() * Math.max(100, maxY),
      size: config.size,
      color: config.color,
      points: config.points,
      lifetime: config.lifetime,
    };
  }, []);

  const spawnTarget = useCallback(() => {
    const target = getRandomTarget();
    const newTarget: Target = {
      ...target,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    setTargets((prev) => [...prev, newTarget]);
  }, [getRandomTarget]);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 40;
      newParticles.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        color,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 600);
  }, []);

  const hitTarget = useCallback((id: string, x: number, y: number) => {
    const target = targets.find((t) => t.id === id);
    if (!target) return;

    const newCombo = combo + 1;
    const multiplier = Math.min(newCombo, 10);
    const points = target.points * multiplier;

    setScore((prev) => prev + points);
    setCombo(newCombo);
    setStreak((prev) => prev + 1);
    setTargets((prev) => prev.filter((t) => t.id !== id));

    // Score popup
    const popup: ScorePopup = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      points,
      combo: newCombo,
    };
    setScorePopups((prev) => [...prev, popup]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== popup.id));
    }, 800);

    // Particles
    const colorMap = {
      cyan: 'hsl(180, 100%, 50%)',
      magenta: 'hsl(300, 100%, 60%)',
      yellow: 'hsl(50, 100%, 50%)',
    };
    createParticles(x, y, colorMap[target.color]);

    // Screen shake
    setShake(true);
    setTimeout(() => setShake(false), 150);

    // Reset combo timeout
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = window.setTimeout(() => {
      setCombo(0);
    }, COMBO_TIMEOUT);
  }, [targets, combo, createParticles]);

  const missTarget = useCallback((id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setLives((prev) => prev - 1);
    setCombo(0);
    setStreak(0);
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLives(MAX_LIVES);
    setCombo(0);
    setStreak(0);
    setTargets([]);
    setIsNewHighScore(false);
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameOver');
    
    if (score > highScore) {
      setHighScore(score);
      setIsNewHighScore(true);
      localStorage.setItem(STORAGE_KEY, score.toString());
    }

    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, [score, highScore]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      
      setTargets((prev) => {
        const expired = prev.filter((t) => now - t.createdAt >= t.lifetime);
        expired.forEach((t) => missTarget(t.id));
        return prev.filter((t) => now - t.createdAt < t.lifetime);
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, missTarget]);

  // Spawn targets
  useEffect(() => {
    if (gameState !== 'playing') return;

    const getSpawnRate = () => {
      const difficulty = Math.min(score / 1000, 1);
      return BASE_SPAWN_RATE - difficulty * (BASE_SPAWN_RATE - MIN_SPAWN_RATE);
    };

    const scheduleSpawn = () => {
      spawnTarget();
      spawnIntervalRef.current = window.setTimeout(scheduleSpawn, getSpawnRate());
    };

    spawnIntervalRef.current = window.setTimeout(scheduleSpawn, 500);

    return () => {
      if (spawnIntervalRef.current) clearTimeout(spawnIntervalRef.current);
    };
  }, [gameState, score, spawnTarget]);

  // Check game over
  useEffect(() => {
    if (gameState === 'playing' && lives <= 0) {
      endGame();
    }
  }, [lives, gameState, endGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'gameOver') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  return {
    gameState,
    score,
    highScore,
    lives,
    maxLives: MAX_LIVES,
    combo,
    streak,
    targets,
    scorePopups,
    particles,
    shake,
    isNewHighScore,
    containerRef,
    startGame,
    hitTarget,
  };
};
