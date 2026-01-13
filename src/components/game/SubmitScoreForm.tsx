import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SubmitScoreFormProps {
  defaultName: string;
  onSubmit: (name: string) => void;
  isSubmitting: boolean;
}

export const SubmitScoreForm: React.FC<SubmitScoreFormProps> = ({
  defaultName,
  onSubmit,
  isSubmitting,
}) => {
  const [name, setName] = useState(defaultName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs mx-auto">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground uppercase tracking-wider">
          Enter Your Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          maxLength={20}
          className="text-center bg-muted/50 border-primary/30 focus:border-primary"
          autoFocus
        />
      </div>
      
      <Button
        type="submit"
        variant="game"
        size="lg"
        disabled={!name.trim() || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : '🚀 Submit Score'}
      </Button>
    </form>
  );
};
