import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameOverProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  isNewHighScore,
  onRestart,
}) => {
  return (
    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-2">
          <h2 className="font-display text-2xl text-muted-foreground uppercase tracking-widest">
            Game Over
          </h2>
          {isNewHighScore && (
            <div className="font-display text-xl text-neon-yellow neon-text-yellow animate-pulse">
              🏆 NEW HIGH SCORE! 🏆
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
              Your Score
            </div>
            <div className={cn(
              'font-display text-6xl font-bold',
              isNewHighScore ? 'text-neon-yellow neon-text-yellow' : 'text-primary neon-text-cyan'
            )}>
              {score.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
              Best Score
            </div>
            <div className="font-display text-2xl text-secondary neon-text-magenta">
              {highScore.toLocaleString()}
            </div>
          </div>
        </div>

        <Button
          variant="game"
          size="xl"
          onClick={onRestart}
          className="mt-8"
        >
          Play Again
        </Button>

        <p className="text-muted-foreground text-sm">
          Tap anywhere or press SPACE to restart
        </p>
      </div>
    </div>
  );
};
