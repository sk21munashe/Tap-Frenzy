import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PLAYER_NAME_KEY = 'tap-frenzy-player-name';

interface SettingsDialogProps {
  onNameChange?: (name: string) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ onNameChange }) => {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem(PLAYER_NAME_KEY) || '';
    setName(storedName);
  }, [open]);

  const handleSave = () => {
    const trimmedName = name.trim().slice(0, 20);
    if (trimmedName) {
      localStorage.setItem(PLAYER_NAME_KEY, trimmedName);
      onNameChange?.(trimmedName);
    } else {
      localStorage.removeItem(PLAYER_NAME_KEY);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setName('');
    localStorage.removeItem(PLAYER_NAME_KEY);
    onNameChange?.('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-30 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              Player Name
            </label>
            <p className="text-xs text-muted-foreground">
              Set your name to appear on the leaderboard. Leave empty to use a random name each game.
            </p>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              className="bg-muted/50 border-primary/30 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="game"
              className="flex-1"
            >
              {saved ? '✓ Saved!' : 'Save Name'}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="border-muted-foreground/30"
            >
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
