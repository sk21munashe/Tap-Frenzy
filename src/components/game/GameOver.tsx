import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Leaderboard } from './Leaderboard';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface GameOverProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  difficultyLevel: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  isNewHighScore,
  difficultyLevel,
  onRestart,
}) => {
  const { leaderboard, isLoading, submitScore, fetchLeaderboard, getPlayerName } = useLeaderboard();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  // Auto-submit score on mount
  useEffect(() => {
    const autoSubmit = async () => {
      if (score > 0 && !hasSubmitted) {
        const result = await submitScore(score, difficultyLevel);
        if (result.success) {
          setHasSubmitted(true);
          setSubmittedName(result.playerName || getPlayerName());
        }
      }
    };
    autoSubmit();
  }, [score, difficultyLevel, submitScore, hasSubmitted, getPlayerName]);

  // Refresh leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-20 overflow-y-auto">
      <div className="text-center space-y-6 p-6 max-w-lg w-full my-4">
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
              'font-display text-5xl font-bold',
              isNewHighScore ? 'text-neon-yellow neon-text-yellow' : 'text-primary neon-text-cyan'
            )}>
              {score.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              Level {difficultyLevel + 1}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
              Personal Best
            </div>
            <div className="font-display text-xl text-secondary neon-text-magenta">
              {highScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Leaderboard with submitted name indicator */}
        {submittedName && (
          <div className="text-sm text-muted-foreground">
            Submitted as: <span className="text-primary font-semibold">{submittedName}</span>
          </div>
        )}
        
        <Leaderboard 
          entries={leaderboard} 
          isLoading={isLoading}
          highlightScore={hasSubmitted ? score : undefined}
        />

        <div className="pt-2">
          <Button
            variant="game"
            size="lg"
            onClick={onRestart}
          >
            Play Again
          </Button>
        </div>

        <p className="text-muted-foreground text-xs">
          Press SPACE to restart
        </p>
      </div>
    </div>
  );
};
