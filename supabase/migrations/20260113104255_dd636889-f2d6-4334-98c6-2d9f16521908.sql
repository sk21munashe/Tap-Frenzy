-- Create leaderboard table for storing global scores
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty_reached INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the leaderboard (public view)
CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard
FOR SELECT
USING (true);

-- Allow anyone to submit scores (no auth required for this casual game)
CREATE POLICY "Anyone can submit scores"
ON public.leaderboard
FOR INSERT
WITH CHECK (true);

-- Create index for fast score ordering
CREATE INDEX idx_leaderboard_score ON public.leaderboard (score DESC);

-- Limit to top 100 scores to keep the table clean
-- We'll handle this in the application logic