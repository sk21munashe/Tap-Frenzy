import React from 'react';

interface ScorePopupProps {
  x: number;
  y: number;
  points: number;
  combo: number;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ x, y, points, combo }) => {
  const isCombo = combo > 1;
  
  return (
    <div
      className="score-float absolute pointer-events-none font-display font-bold"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        fontSize: isCombo ? '1.5rem' : '1.25rem',
        color: isCombo ? 'hsl(var(--neon-yellow))' : 'hsl(var(--primary))',
        textShadow: isCombo 
          ? '0 0 10px hsl(var(--neon-yellow)), 0 0 20px hsl(var(--neon-yellow))'
          : '0 0 10px hsl(var(--primary))',
      }}
    >
      +{points}
      {isCombo && <span className="text-sm ml-1">x{combo}</span>}
    </div>
  );
};
