import React from 'react';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ highScore, onStart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-neon-yellow">
            TAP FRENZY
          </h1>
          <p className="text-muted-foreground text-lg font-body max-w-md mx-auto">
            Tap the glowing targets before they disappear. Build combos for massive points!
          </p>
        </div>

        {highScore > 0 && (
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm uppercase tracking-wider">
              Your Best
            </div>
            <div className="font-display text-3xl text-secondary neon-text-magenta">
              {highScore.toLocaleString()}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            variant="game"
            size="xl"
            onClick={onStart}
            className="text-xl"
          >
            Start Game
          </Button>
          
          <p className="text-muted-foreground text-sm">
            Tap or press SPACE to begin
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-8 text-center">
          <div>
            <div className="w-8 h-8 rounded-full bg-neon-cyan neon-box-cyan mx-auto mb-2" />
            <div className="text-xs text-muted-foreground">10 pts</div>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-neon-magenta neon-box-magenta mx-auto mb-2" />
            <div className="text-xs text-muted-foreground">25 pts</div>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-neon-yellow mx-auto mb-2" style={{ boxShadow: '0 0 20px hsl(50 100% 50% / 0.6)' }} />
            <div className="text-xs text-muted-foreground">50 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
