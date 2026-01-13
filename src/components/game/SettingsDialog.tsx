import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Music, Vibrate, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PLAYER_NAME_KEY = 'tap-frenzy-player-name';
const SOUND_ENABLED_KEY = 'tap-frenzy-sound-enabled';
const MUSIC_ENABLED_KEY = 'tap-frenzy-music-enabled';
const VIBRATION_ENABLED_KEY = 'tap-frenzy-vibration-enabled';

interface SettingsDialogProps {
  onNameChange?: (name: string) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ onNameChange }) => {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem(PLAYER_NAME_KEY) || '';
    const storedSound = localStorage.getItem(SOUND_ENABLED_KEY);
    const storedMusic = localStorage.getItem(MUSIC_ENABLED_KEY);
    const storedVibration = localStorage.getItem(VIBRATION_ENABLED_KEY);
    
    setName(storedName);
    setSoundEnabled(storedSound !== 'false');
    setMusicEnabled(storedMusic !== 'false');
    setVibrationEnabled(storedVibration !== 'false');
  }, [open]);

  const handleNameChange = (value: string) => {
    setName(value);
    const trimmedName = value.trim().slice(0, 20);
    if (trimmedName) {
      localStorage.setItem(PLAYER_NAME_KEY, trimmedName);
      onNameChange?.(trimmedName);
    } else {
      localStorage.removeItem(PLAYER_NAME_KEY);
      onNameChange?.('');
    }
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  };

  const handleMusicToggle = (enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem(MUSIC_ENABLED_KEY, String(enabled));
  };

  const handleVibrationToggle = (enabled: boolean) => {
    setVibrationEnabled(enabled);
    localStorage.setItem(VIBRATION_ENABLED_KEY, String(enabled));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Player Name */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
              <User className="h-4 w-4" />
              Player Name
            </div>
            <Input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              className="bg-muted/50 border-primary/30 focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use a random name each game
            </p>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <div className="text-sm font-medium">Sound Effects</div>
                <div className="text-xs text-muted-foreground">Tap and hit sounds</div>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          {/* Music */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className={`h-5 w-5 ${musicEnabled ? 'text-secondary' : 'text-muted-foreground'}`} />
              <div>
                <div className="text-sm font-medium">Background Music</div>
                <div className="text-xs text-muted-foreground">In-game music</div>
              </div>
            </div>
            <Switch
              checked={musicEnabled}
              onCheckedChange={handleMusicToggle}
            />
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate className={`h-5 w-5 ${vibrationEnabled ? 'text-neon-yellow' : 'text-muted-foreground'}`} />
              <div>
                <div className="text-sm font-medium">Vibration</div>
                <div className="text-xs text-muted-foreground">Haptic feedback on tap</div>
              </div>
            </div>
            <Switch
              checked={vibrationEnabled}
              onCheckedChange={handleVibrationToggle}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};