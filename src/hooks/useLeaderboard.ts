import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  difficulty_reached: number;
  created_at: string;
}

const PLAYER_NAME_KEY = 'tap-frenzy-player-name';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem(PLAYER_NAME_KEY) || '';
  });
  const [playerRank, setPlayerRank] = useState<number | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitScore = useCallback(async (score: number, difficultyReached: number, name: string) => {
    if (!name.trim()) return { success: false, error: 'Name required' };

    // Save name for future games
    localStorage.setItem(PLAYER_NAME_KEY, name);
    setPlayerName(name);

    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert({
          player_name: name.trim().slice(0, 20),
          score,
          difficulty_reached: difficultyReached,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh leaderboard and find player's rank
      await fetchLeaderboard();
      
      return { success: true, data };
    } catch (err) {
      console.error('Failed to submit score:', err);
      return { success: false, error: 'Failed to submit score' };
    }
  }, [fetchLeaderboard]);

  const getPlayerRank = useCallback(async (score: number) => {
    try {
      const { count, error } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('score', score);

      if (error) throw error;
      setPlayerRank((count || 0) + 1);
      return (count || 0) + 1;
    } catch (err) {
      console.error('Failed to get rank:', err);
      return null;
    }
  }, []);

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    isLoading,
    playerName,
    playerRank,
    fetchLeaderboard,
    submitScore,
    getPlayerRank,
    setPlayerName,
  };
};
