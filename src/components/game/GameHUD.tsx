import React from 'react';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  score: number;
  highScore: number;
  combo: number;
  streak: number;
  lives: number;
  maxLives: number;
  difficultyLevel?: number;
}

const DIFFICULTY_NAMES = ['EASY', 'WARM UP', 'NORMAL', 'FAST', 'INTENSE', 'INSANE', 'GODLIKE'];

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  combo,
  streak,
  lives,
  maxLives,
  difficultyLevel = 0,
}) => {
  return (
    <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start pointer-events-none z-10">
      {/* Left side - Score */}
      <div className="space-y-2">
        <div className="font-display text-3xl font-bold text-primary neon-text-cyan">
          {score.toLocaleString()}
        </div>
        <div className="text-muted-foreground text-sm font-body">
          BEST: {highScore.toLocaleString()}
        </div>
      </div>

      {/* Center - Combo */}
      <div className="text-center">
        {combo > 1 && (
          <div className={cn('combo-pop font-display font-bold', combo >= 5 ? 'text-neon-yellow neon-text-yellow' : 'text-secondary neon-text-magenta')}>
            <div className="text-4xl">{combo}x</div>
            <div className="text-xs uppercase tracking-widest">Combo</div>
          </div>
        )}
        {streak > 0 && (
          <div className="mt-2 text-neon-green text-sm font-display">
            🔥 {streak} streak
          </div>
        )}
      </div>

      {/* Right side - Lives & Difficulty */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-1">
          {Array.from({ length: maxLives }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-4 rounded-full transition-all duration-300',
                i < lives 
                  ? 'bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]' 
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
        {difficultyLevel > 0 && (
          <div className={cn(
            'text-xs font-display tracking-widest px-2 py-0.5 rounded animate-pulse',
            difficultyLevel >= 5 ? 'bg-destructive/20 text-destructive' : 
            difficultyLevel >= 3 ? 'bg-neon-yellow/20 text-neon-yellow' : 
            'bg-primary/20 text-primary'
          )}>
            {DIFFICULTY_NAMES[difficultyLevel] || `LVL ${difficultyLevel}`}
          </div>
        )}
      </div>
    </div>
  );
};
