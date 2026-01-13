import React from 'react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  difficulty_reached: number;
  created_at: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  highlightScore?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  isLoading,
  highlightScore,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No scores yet. Be the first!
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="font-display text-xl text-primary neon-text-cyan text-center mb-4 uppercase tracking-widest">
        🏆 Global Leaderboard
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
        {entries.slice(0, 10).map((entry, index) => {
          const isHighlighted = highlightScore === entry.score;
          const rankColors = [
            'text-neon-yellow neon-text-yellow', // 1st
            'text-gray-300', // 2nd
            'text-amber-600', // 3rd
          ];
          
          return (
            <div
              key={entry.id}
              className={cn(
                'flex items-center gap-3 py-2 px-3 rounded-lg transition-all',
                isHighlighted 
                  ? 'bg-primary/20 border border-primary/50' 
                  : 'bg-muted/30 hover:bg-muted/50'
              )}
            >
              <div className={cn(
                'font-display text-lg w-8 text-center',
                index < 3 ? rankColors[index] : 'text-muted-foreground'
              )}>
                {index === 0 ? '👑' : index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'font-medium truncate',
                  isHighlighted ? 'text-primary' : 'text-foreground'
                )}>
                  {entry.player_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Level {entry.difficulty_reached + 1}
                </div>
              </div>
              
              <div className={cn(
                'font-display text-lg',
                index === 0 
                  ? 'text-neon-yellow neon-text-yellow' 
                  : isHighlighted 
                    ? 'text-primary neon-text-cyan'
                    : 'text-secondary neon-text-magenta'
              )}>
                {entry.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
