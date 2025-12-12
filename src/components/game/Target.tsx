import React from 'react';
import { cn } from '@/lib/utils';

interface TargetProps {
  id: string;
  x: number;
  y: number;
  size: number;
  color: 'cyan' | 'magenta' | 'yellow';
  onClick: (id: string, x: number, y: number) => void;
  timeLeft: number;
  maxTime: number;
}

const colorClasses = {
  cyan: 'bg-neon-cyan neon-box-cyan',
  magenta: 'bg-neon-magenta neon-box-magenta',
  yellow: 'bg-neon-yellow',
};

export const Target: React.FC<TargetProps> = ({
  id,
  x,
  y,
  size,
  color,
  onClick,
  timeLeft,
  maxTime,
}) => {
  const progress = timeLeft / maxTime;
  const urgencyScale = 1 + (1 - progress) * 0.3;

  return (
    <button
      className={cn(
        'game-target',
        colorClasses[color],
        progress < 0.3 && 'animate-pulse'
      )}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `scale(${urgencyScale})`,
        opacity: 0.6 + progress * 0.4,
      }}
      onClick={() => onClick(id, x + size / 2, y + size / 2)}
    />
  );
};
