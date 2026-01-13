import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaderboard } from './Leaderboard';
import { SettingsDialog } from './SettingsDialog';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ highScore, onStart }) => {
  const { leaderboard, isLoading } = useLeaderboard();

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto">
      {/* Settings Button */}
      <SettingsDialog />
      
      <div className="min-h-full flex items-center justify-center py-6">
        <div className="text-center space-y-6 p-6">
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-neon-yellow">
            TAP FRENZY
          </h1>
          <p className="text-muted-foreground text-base font-body max-w-md mx-auto">
            Tap the glowing targets before they disappear. Build combos for massive points!
          </p>
        </div>

        {highScore > 0 && (
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm uppercase tracking-wider">
              Your Best
            </div>
            <div className="font-display text-2xl text-secondary neon-text-magenta">
              {highScore.toLocaleString()}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="game"
            size="xl"
            onClick={onStart}
            className="text-lg"
          >
            Start Game
          </Button>
          
          <p className="text-muted-foreground text-sm">
            Tap or press SPACE to begin
          </p>
        </div>

        {/* Leaderboard */}
        <div className="pt-4">
          <Leaderboard entries={leaderboard} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-4 text-center">
          <div>
            <div className="w-6 h-6 rounded-full bg-neon-cyan neon-box-cyan mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">10 pts</div>
          </div>
          <div>
            <div className="w-6 h-6 rounded-full bg-neon-magenta neon-box-magenta mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">25 pts</div>
          </div>
          <div>
            <div className="w-6 h-6 rounded-full bg-neon-yellow mx-auto mb-1" style={{ boxShadow: '0 0 20px hsl(50 100% 50% / 0.6)' }} />
            <div className="text-xs text-muted-foreground">50 pts</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
